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
const activar_contrato_dto_1 = require("./dto/activar-contrato.dto");
const completar_contrato_dto_1 = require("./dto/completar-contrato.dto");
const cancelar_contrato_dto_1 = require("./dto/cancelar-contrato.dto");
const cerrar_contrato_dto_1 = require("./dto/cerrar-contrato.dto");
let ContractsController = class ContractsController {
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    async create(createContratoDto, req) {
        try {
            const contrato = await this.contractsService.create(createContratoDto);
            return {
                status: 'success',
                message: 'Contrato creado exitosamente',
                data: {
                    id: contrato.id,
                    codigo_contrato: contrato.codigo_contrato,
                    pin_activacion: contrato.pin_activacion,
                    codigo_qr_url: contrato.codigo_qr_url,
                    estado: contrato.estado,
                    monto_total: contrato.monto_total,
                    monto_trabajador: contrato.monto_trabajador,
                    fecha_inicio_programada: contrato.fecha_inicio_programada,
                    empleador: {
                        id: contrato.empleador.id,
                        nombre: contrato.empleador.nombre,
                        apellido: contrato.empleador.apellido
                    },
                    trabajador: {
                        id: contrato.trabajador.id,
                        nombre: contrato.trabajador.nombre,
                        apellido: contrato.trabajador.apellido
                    }
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async activarContrato(activarDto, req, ip) {
        try {
            const contrato = await this.contractsService.activarContrato(activarDto, req.user.id, ip);
            return {
                status: 'success',
                message: '¡Contrato activado exitosamente! El trabajo puede comenzar.',
                data: {
                    id: contrato.id,
                    codigo_contrato: contrato.codigo_contrato,
                    estado: contrato.estado,
                    fecha_activacion: contrato.fecha_activacion,
                    activado_por: contrato.activado_por,
                    metodo_activacion: contrato.metodo_activacion,
                    estado_pago: contrato.estado_pago
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async completarContrato(id, completarDto, req) {
        try {
            const contrato = await this.contractsService.completarContrato(id, req.user.id, completarDto.notas);
            return {
                status: 'success',
                message: 'Trabajo marcado como completado. Esperando confirmación del cliente.',
                data: {
                    id: contrato.id,
                    estado: contrato.estado,
                    fecha_completado: contrato.fecha_completado
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async cerrarContrato(id, cerrarDto, req) {
        try {
            const contrato = await this.contractsService.cerrarContrato(id, req.user.id, cerrarDto.notas);
            return {
                status: 'success',
                message: 'Contrato cerrado y pago liberado al trabajador.',
                data: {
                    id: contrato.id,
                    estado: contrato.estado,
                    estado_pago: contrato.estado_pago,
                    fecha_cierre: contrato.fecha_cierre,
                    monto_trabajador: contrato.monto_trabajador
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async cancelarContrato(id, cancelarDto, req) {
        try {
            const contrato = await this.contractsService.cancelarContrato(id, req.user.id, cancelarDto.motivo);
            return {
                status: 'success',
                message: 'Contrato cancelado exitosamente',
                data: {
                    id: contrato.id,
                    estado: contrato.estado,
                    estado_pago: contrato.estado_pago
                }
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async findAll(empleadorId, trabajadorId, estado, req) {
        try {
            const filters = {};
            if (empleadorId) {
                filters.empleadorId = empleadorId;
            }
            else if (trabajadorId) {
                filters.trabajadorId = trabajadorId;
            }
            else if (req?.user) {
            }
            if (estado) {
                filters.estado = estado;
            }
            const contratos = await this.contractsService.findAll(filters);
            return {
                status: 'success',
                data: contratos,
                count: contratos.length
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: []
            };
        }
    }
    async getMisContratos(req, rol, estado) {
        try {
            const userId = req.user.id;
            const filters = {};
            if (rol === 'empleador') {
                filters.empleadorId = userId;
            }
            else if (rol === 'trabajador') {
                filters.trabajadorId = userId;
            }
            else {
                const contratosComoEmpleador = await this.contractsService.findAll({
                    empleadorId: userId,
                    estado
                });
                const contratosComoTrabajador = await this.contractsService.findAll({
                    trabajadorId: userId,
                    estado
                });
                const todosLosContratos = [...contratosComoEmpleador, ...contratosComoTrabajador];
                return {
                    status: 'success',
                    data: todosLosContratos,
                    count: todosLosContratos.length
                };
            }
            if (estado) {
                filters.estado = estado;
            }
            const contratos = await this.contractsService.findAll(filters);
            return {
                status: 'success',
                data: contratos,
                count: contratos.length
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: []
            };
        }
    }
    async findOne(id) {
        try {
            const contrato = await this.contractsService.findOne(id);
            return {
                status: 'success',
                data: contrato
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async findByCodigoContrato(codigo) {
        try {
            const contrato = await this.contractsService.findByCodigoContrato(codigo);
            return {
                status: 'success',
                data: contrato
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
    async getHistorialEstados(id) {
        try {
            const historial = await this.contractsService.getHistorialEstados(id);
            return {
                status: 'success',
                data: historial
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: []
            };
        }
    }
    async getAllContracts(estado, page = 1, limit = 20) {
        try {
            const filters = {};
            if (estado) {
                filters.estado = estado;
            }
            const contratos = await this.contractsService.findAll(filters);
            return {
                status: 'success',
                data: contratos,
                count: contratos.length,
                page,
                limit
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: []
            };
        }
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contrato_dto_1.CreateContratoDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('activar'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activar_contrato_dto_1.ActivarContratoDto, Object, String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "activarContrato", null);
__decorate([
    (0, common_1.Patch)(':id/completar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, completar_contrato_dto_1.CompletarContratoDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "completarContrato", null);
__decorate([
    (0, common_1.Patch)(':id/cerrar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cerrar_contrato_dto_1.CerrarContratoDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "cerrarContrato", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancelar_contrato_dto_1.CancelarContratoDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "cancelarContrato", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('empleadorId')),
    __param(1, (0, common_1.Query)('trabajadorId')),
    __param(2, (0, common_1.Query)('estado')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mis-contratos'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('rol')),
    __param(2, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getMisContratos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('codigo/:codigo'),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findByCodigoContrato", null);
__decorate([
    (0, common_1.Get)(':id/historial'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getHistorialEstados", null);
__decorate([
    (0, common_1.Get)('admin/todos'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getAllContracts", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_1.Controller)('contracts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map