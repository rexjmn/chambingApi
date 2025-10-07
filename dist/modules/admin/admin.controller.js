"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let AdminController = class AdminController {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async getAdminStats(period = 'month') {
        const now = new Date();
        const currentPeriodStart = this.getPeriodStart(now, period);
        const previousPeriodStart = this.getPeriodStart(currentPeriodStart, period);
        const [totalUsers, currentPeriodUsers, previousPeriodUsers, totalWorkers, verifiedWorkers, pendingWorkers, totalClients] = await Promise.all([
            this.usersRepository.count(),
            this.usersRepository.count({
                where: { fecha_registro: (0, typeorm_2.MoreThanOrEqual)(currentPeriodStart) }
            }),
            this.usersRepository.count({
                where: {
                    fecha_registro: (0, typeorm_2.Between)(previousPeriodStart, currentPeriodStart)
                }
            }),
            this.usersRepository.count({ where: { tipo_usuario: 'trabajador' } }),
            this.usersRepository.count({
                where: { tipo_usuario: 'trabajador', verificado: true }
            }),
            this.usersRepository.count({
                where: { tipo_usuario: 'trabajador', verificado: false }
            }),
            this.usersRepository.count({ where: { tipo_usuario: 'cliente' } })
        ]);
        return {
            status: 'success',
            data: {
                totalUsers,
                previousTotalUsers: totalUsers - currentPeriodUsers + previousPeriodUsers,
                totalWorkers,
                verifiedWorkers,
                pendingWorkers,
                totalClients,
                activeContracts: 0,
                previousActiveContracts: 0,
                totalContracts: 0,
                contractsDistribution: {
                    pending: 0,
                    inProgress: 0,
                    completed: 0,
                    cancelled: 0
                },
                pendingDocuments: 0,
                previousPendingDocuments: 0,
                monthlyRevenue: 0,
                previousMonthlyRevenue: 0,
                userGrowth: currentPeriodUsers,
                userGrowthPercentage: this.calculateGrowthPercentage(currentPeriodUsers, previousPeriodUsers)
            }
        };
    }
    async getDashboardMetrics() {
        const stats = await this.getAdminStats('month');
        const userGrowthData = await this.getUserGrowthData();
        const recentActivity = await this.getRecentActivity();
        return {
            status: 'success',
            data: {
                ...stats.data,
                userGrowthData,
                recentActivity
            }
        };
    }
    async getUserGrowthData() {
        const months = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const count = await this.usersRepository.count({
                where: {
                    fecha_registro: (0, typeorm_2.Between)(monthStart, monthEnd)
                }
            });
            months.push({
                month: monthStart.toLocaleString('en', { month: 'short' }),
                users: count,
                date: monthStart
            });
        }
        let accumulated = 0;
        return months.map(m => {
            accumulated += m.users;
            return {
                month: m.month,
                users: accumulated
            };
        });
    }
    async getRecentActivity() {
        const recentUsers = await this.usersRepository.find({
            order: { fecha_registro: 'DESC' },
            take: 5,
            select: ['id', 'nombre', 'apellido', 'tipo_usuario', 'fecha_registro', 'foto_perfil']
        });
        const activity = recentUsers.map(user => ({
            type: 'user',
            user: `${user.nombre} ${user.apellido}`,
            action: user.tipo_usuario === 'trabajador' ? 'registered as worker' : 'registered',
            timestamp: user.fecha_registro,
            avatar: user.foto_perfil || null,
            userType: user.tipo_usuario
        }));
        return activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    }
    async getWorkersStats() {
        const [totalWorkers, verifiedWorkers, pendingWorkers, workersWithPhoto, workersWithSkills] = await Promise.all([
            this.usersRepository.count({ where: { tipo_usuario: 'trabajador' } }),
            this.usersRepository.count({
                where: { tipo_usuario: 'trabajador', verificado: true }
            }),
            this.usersRepository.count({
                where: { tipo_usuario: 'trabajador', verificado: false }
            }),
            this.usersRepository
                .createQueryBuilder('user')
                .where('user.tipo_usuario = :tipo', { tipo: 'trabajador' })
                .andWhere('user.foto_perfil IS NOT NULL')
                .getCount(),
            this.usersRepository
                .createQueryBuilder('user')
                .leftJoin('user.habilidades', 'habilidades')
                .where('user.tipo_usuario = :tipo', { tipo: 'trabajador' })
                .andWhere('habilidades.id IS NOT NULL')
                .getCount()
        ]);
        return {
            status: 'success',
            data: {
                totalWorkers,
                verifiedWorkers,
                pendingWorkers,
                workersWithPhoto,
                workersWithSkills,
                verificationRate: totalWorkers > 0
                    ? ((verifiedWorkers / totalWorkers) * 100).toFixed(1)
                    : 0
            }
        };
    }
    getPeriodStart(date, period) {
        const start = new Date(date);
        switch (period) {
            case 'week':
                start.setDate(start.getDate() - 7);
                break;
            case 'month':
                start.setMonth(start.getMonth() - 1);
                break;
            case 'year':
                start.setFullYear(start.getFullYear() - 1);
                break;
            default:
                start.setMonth(start.getMonth() - 1);
        }
        return start;
    }
    calculateGrowthPercentage(current, previous) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, common_1.Get)('workers/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWorkersStats", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminController);
//# sourceMappingURL=admin.controller.js.map