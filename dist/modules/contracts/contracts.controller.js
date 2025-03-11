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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_service_1 = require("./contracts.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const create_contrato_dto_1 = require("./dto/create-contrato.dto");
let ContractsController = class ContractsController {
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    create(createContratoDto) {
        return this.contractsService.create(createContratoDto);
    }
    findAll(empleadorId, trabajadorId, estado, fechaInicio, fechaFin) {
        return this.contractsService.findAll({
            empleadorId,
            trabajadorId,
            estado,
            fechaInicio,
            fechaFin
        });
    }
    findOne(id) {
        return this.contractsService.findOne(id);
    }
    updateEstado(id, data) {
        return this.contractsService.updateEstado(id, data.nuevoEstado, data.usuarioId, data.notas);
    }
    getHistorialEstados(id) {
        return this.contractsService.getHistorialEstados(id);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.RequireRoles)('empleador', 'admin', 'super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contrato_dto_1.CreateContratoDto]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('empleadorId')),
    __param(1, (0, common_1.Query)('trabajadorId')),
    __param(2, (0, common_1.Query)('estado')),
    __param(3, (0, common_1.Query)('fechaInicio')),
    __param(4, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Date,
        Date]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/estado'),
    (0, roles_decorator_1.RequireRoles)('empleador', 'admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "updateEstado", null);
__decorate([
    (0, common_1.Get)(':id/historial'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "getHistorialEstados", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_1.Controller)('contracts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map