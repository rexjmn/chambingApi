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
var PaymentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const crear_pago_dto_1 = require("./dto/crear-pago.dto");
let PaymentsController = PaymentsController_1 = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
        this.logger = new common_1.Logger(PaymentsController_1.name);
    }
    async crearPago(dto, req) {
        this.logger.log(`Usuario ${req.user.id} creando pago para contrato ${dto.contratoId}`);
        const pago = await this.paymentsService.crearPago(dto);
        return {
            success: true,
            message: 'Pago creado exitosamente',
            data: pago,
        };
    }
    async procesarPagoEfectivo(pagoId, dto, req) {
        this.logger.log(`Usuario ${req.user.id} procesando pago efectivo ${pagoId}`);
        const pago = await this.paymentsService.procesarPagoEfectivo(pagoId, dto.confirmado, dto.notas);
        return {
            success: true,
            message: dto.confirmado ? 'Pago confirmado' : 'Pago rechazado',
            data: pago,
        };
    }
    async webhookWompi(payload) {
        this.logger.log(`Webhook recibido de Wompi: ${payload.transaction_id}`);
        try {
            await this.paymentsService.manejarWebhookWompi(payload);
            return { success: true };
        }
        catch (error) {
            this.logger.error('Error procesando webhook:', error);
            return { success: false, error: 'Error interno' };
        }
    }
    async obtenerSaldo(req) {
        const saldo = await this.paymentsService.obtenerSaldoTrabajador(req.user.id);
        return {
            success: true,
            data: {
                saldoDisponible: saldo.saldoDisponible,
                comisionesPendientes: saldo.saldoComisionesPendientes,
                totalGanado: saldo.totalGanado,
                puedeTrabajar: saldo.puedeTrabajar(),
                bloqueadoPorDeuda: saldo.bloqueadoPorDeuda,
                fechaUltimoPago: saldo.fechaUltimoPago,
            },
        };
    }
    async obtenerHistorial(req, limite = '10', offset = '0') {
        const { pagos, total } = await this.paymentsService.obtenerHistorialPagos(req.user.id, parseInt(limite), parseInt(offset));
        return {
            success: true,
            data: {
                pagos,
                total,
                limite: parseInt(limite),
                offset: parseInt(offset),
            },
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_pago_dto_1.CrearPagoDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "crearPago", null);
__decorate([
    (0, common_1.Post)(':id/efectivo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crear_pago_dto_1.ProcesarPagoEfectivoDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "procesarPagoEfectivo", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhookWompi", null);
__decorate([
    (0, common_1.Get)('saldo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "obtenerSaldo", null);
__decorate([
    (0, common_1.Get)('historial'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limite')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "obtenerHistorial", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map