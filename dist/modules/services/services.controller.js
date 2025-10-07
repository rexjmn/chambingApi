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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("./services.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const create_tarifa_dto_1 = require("./dto/create-tarifa.dto");
const create_trabajador_categoria_dto_1 = require("./dto/create-trabajador-categoria.dto");
const create_tarifa_trabajador_dto_1 = require("./dto/create-tarifa-trabajador.dto");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    testConnection() {
        return {
            message: 'Services module is working!',
            timestamp: new Date().toISOString(),
            status: 'success'
        };
    }
    findAllCategorias() {
        return this.servicesService.findAllCategorias();
    }
    findCategoriaById(id) {
        return this.servicesService.findCategoriaById(id);
    }
    getTrabajadoresByCategoria(id) {
        return this.servicesService.getTrabajadoresByCategoria(id);
    }
    createCategoria(createCategoriaDto) {
        return this.servicesService.createCategoria(createCategoriaDto);
    }
    updateCategoria(id, updateCategoriaDto) {
        return this.servicesService.updateCategoria(id, updateCategoriaDto);
    }
    async deleteCategoria(id) {
        await this.servicesService.deleteCategoria(id);
        return {
            status: 'success',
            message: 'Categoría eliminada exitosamente'
        };
    }
    createTarifa(createTarifaDto) {
        return this.servicesService.createTarifa(createTarifaDto);
    }
    async createTarifaTrabajador(trabajadorId, dto, req) {
        if (req.user.id !== trabajadorId && !req.user.roles?.includes('admin')) {
            throw new common_1.ForbiddenException('No tienes permiso para crear tarifas para este trabajador');
        }
        dto.trabajadorId = trabajadorId;
        return this.servicesService.createTarifaTrabajador(dto);
    }
    async updateTarifaTrabajador(trabajadorId, dto, req) {
        if (req.user.id !== trabajadorId && !req.user.roles?.includes('admin')) {
            throw new common_1.ForbiddenException('No tienes permiso');
        }
        return this.servicesService.updateTarifaTrabajador(trabajadorId, dto);
    }
    async getTarifasByTrabajador(trabajadorId) {
        return this.servicesService.getTarifasByTrabajador(trabajadorId);
    }
    async deleteTarifaTrabajador(trabajadorId, req) {
        if (req.user.id !== trabajadorId && !req.user.roles?.includes('admin')) {
            throw new common_1.ForbiddenException('No tienes permiso');
        }
        await this.servicesService.deleteTarifaTrabajador(trabajadorId);
        return { status: 'success', message: 'Tarifas eliminadas' };
    }
    assignTrabajadorToCategoria(createTrabajadorCategoriaDto) {
        return this.servicesService.assignTrabajadorToCategoria(createTrabajadorCategoriaDto);
    }
    findAllCategoriasAlias() {
        return this.servicesService.findAllCategorias();
    }
    createCategoriaAlias(createCategoriaDto) {
        return this.servicesService.createCategoria(createCategoriaDto);
    }
    updateCategoriaAlias(id, updateCategoriaDto) {
        return this.servicesService.updateCategoria(id, updateCategoriaDto);
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findAllCategorias", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findCategoriaById", null);
__decorate([
    (0, common_1.Get)('categories/:id/trabajadores'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getTrabajadoresByCategoria", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "createCategoria", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "updateCategoria", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteCategoria", null);
__decorate([
    (0, common_1.Post)('tarifas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tarifa_dto_1.CreateTarifaDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "createTarifa", null);
__decorate([
    (0, common_1.Post)('trabajadores/:id/tarifas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tarifa_trabajador_dto_1.CreateTarifaTrabajadorDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createTarifaTrabajador", null);
__decorate([
    (0, common_1.Patch)('trabajadores/:id/tarifas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tarifa_trabajador_dto_1.UpdateTarifaTrabajadorDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "updateTarifaTrabajador", null);
__decorate([
    (0, common_1.Get)('trabajadores/:id/tarifas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getTarifasByTrabajador", null);
__decorate([
    (0, common_1.Delete)('trabajadores/:id/tarifas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteTarifaTrabajador", null);
__decorate([
    (0, common_1.Post)('trabajadores/asignar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_trabajador_categoria_dto_1.CreateTrabajadorCategoriaDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "assignTrabajadorToCategoria", null);
__decorate([
    (0, common_1.Get)('categorias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findAllCategoriasAlias", null);
__decorate([
    (0, common_1.Post)('categorias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "createCategoriaAlias", null);
__decorate([
    (0, common_1.Patch)('categorias/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "updateCategoriaAlias", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map