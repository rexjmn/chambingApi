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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pago_entity_1 = require("./entities/pago.entity");
const saldo_trabajador_entity_1 = require("./entities/saldo-trabajador.entity");
const transaccion_wompi_entity_1 = require("./entities/transaccion-wompi.entity");
const notificacion_pago_entity_1 = require("./entities/notificacion-pago.entity");
const wompi_service_1 = require("./services/wompi.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(pagoRepository, saldoRepository, transaccionRepository, notificacionRepository, wompiService) {
        this.pagoRepository = pagoRepository;
        this.saldoRepository = saldoRepository;
        this.transaccionRepository = transaccionRepository;
        this.notificacionRepository = notificacionRepository;
        this.wompiService = wompiService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async crearPago(dto) {
        this.logger.log(`Creando pago para contrato: ${dto.contratoId}`);
        const pago = new pago_entity_1.Pago();
        pago.contratoId = dto.contratoId;
        pago.trabajadorId = dto.trabajadorId;
        pago.empleadorId = dto.empleadorId;
        pago.montoServicio = dto.montoServicio;
        pago.metodoPago = dto.metodoPago;
        const porcentajeComision = dto.porcentajeComision || 10;
        pago.calcularComision(porcentajeComision);
        const pagoGuardado = await this.pagoRepository.save(pago);
        if (pago.esMetodoElectronico()) {
            await this.crearTransaccionWompi(pagoGuardado);
        }
        else {
            await this.procesarPagoEfectivo(pagoGuardado.id, true);
        }
        return pagoGuardado;
    }
    async crearTransaccionWompi(pago) {
        const referencia = `CHAMBING_${pago.id}`;
        const descripcion = `Pago de servicio - Contrato ${pago.contratoId}`;
        const wompiResponse = await this.wompiService.crearEnlacePago(pago.montoServicio, descripcion, referencia, `${process.env.APP_URL}/api/payments/webhook`);
        if (!wompiResponse.success) {
            throw new Error(`Error creando pago Wompi: ${wompiResponse.error}`);
        }
        const transaccion = new transaccion_wompi_entity_1.TransaccionWompi();
        transaccion.pagoId = pago.id;
        transaccion.wompiTransactionId = wompiResponse.transaction_id || '';
        transaccion.wompiReference = wompiResponse.reference || '';
        transaccion.estadoWompi = wompiResponse.status || '';
        transaccion.monto = pago.montoServicio;
        transaccion.metodoPagoWompi = pago.metodoPago === pago_entity_1.MetodoPago.WOMPI_BITCOIN ? 'BITCOIN' : 'CARD';
        return await this.transaccionRepository.save(transaccion);
    }
    async procesarPagoEfectivo(pagoId, confirmado, notas) {
        const pago = await this.pagoRepository.findOne({
            where: { id: pagoId },
        });
        if (!pago) {
            throw new common_1.NotFoundException('Pago no encontrado');
        }
        if (confirmado) {
            pago.estadoPago = pago_entity_1.EstadoPago.COMPLETADO;
            pago.notas = notas || '';
            await this.actualizarSaldoTrabajador(pago.trabajadorId, pago.montoTrabajador, pago.comisionPlataforma);
            await this.crearNotificacion(pago.trabajadorId, notificacion_pago_entity_1.TipoNotificacion.COMISION_PENDIENTE, 'Comisión pendiente de pago', `Tienes $${pago.comisionPlataforma} en comisiones pendientes por el servicio completado.`, { pagoId: pago.id, monto: pago.comisionPlataforma });
        }
        else {
            pago.estadoPago = pago_entity_1.EstadoPago.FALLIDO;
            pago.notas = notas || 'Pago en efectivo no confirmado';
        }
        return await this.pagoRepository.save(pago);
    }
    async manejarWebhookWompi(payload) {
        this.logger.log(`Webhook recibido: ${payload.transaction_id}`);
        const esValido = await this.wompiService.procesarWebhook(payload);
        if (!esValido) {
            this.logger.error('Webhook inválido');
            return;
        }
        const transaccion = await this.transaccionRepository.findOne({
            where: { wompiTransactionId: payload.transaction_id },
        });
        if (!transaccion) {
            this.logger.error(`Transacción no encontrada: ${payload.transaction_id}`);
            return;
        }
        transaccion.estadoWompi = payload.status;
        transaccion.webhookData = payload;
        await this.transaccionRepository.save(transaccion);
        const pago = await this.pagoRepository.findOne({
            where: { id: transaccion.pagoId },
        });
        if (!pago) {
            this.logger.error(`Pago no encontrado: ${transaccion.pagoId}`);
            return;
        }
        if (payload.status === 'APPROVED') {
            pago.estadoPago = pago_entity_1.EstadoPago.COMPLETADO;
            pago.referenciaExterna = payload.transaction_id;
            await this.actualizarSaldoTrabajador(pago.trabajadorId, pago.montoTrabajador, 0);
            pago.comisionPagada = true;
            pago.fechaPagoComision = new Date();
            await this.crearNotificacion(pago.trabajadorId, notificacion_pago_entity_1.TipoNotificacion.PAGO_RECIBIDO, 'Pago recibido exitosamente', `Has recibido $${pago.montoTrabajador} por tu servicio completado.`, { pagoId: pago.id, metodo: payload.payment_method });
        }
        else if (payload.status === 'DECLINED') {
            pago.estadoPago = pago_entity_1.EstadoPago.FALLIDO;
            await this.crearNotificacion(pago.trabajadorId, notificacion_pago_entity_1.TipoNotificacion.PAGO_FALLIDO, 'Pago fallido', 'El pago del cliente fue rechazado. Por favor, contacta al cliente para resolver el problema.', { pagoId: pago.id, razon: 'Pago rechazado por Wompi' });
        }
        await this.pagoRepository.save(pago);
    }
    async actualizarSaldoTrabajador(trabajadorId, montoGanado, comisionPendiente) {
        let saldo = await this.saldoRepository.findOne({
            where: { trabajadorId },
        });
        if (!saldo) {
            saldo = new saldo_trabajador_entity_1.SaldoTrabajador();
            saldo.trabajadorId = trabajadorId;
        }
        saldo.saldoDisponible += montoGanado;
        saldo.totalGanado += montoGanado;
        if (comisionPendiente > 0) {
            saldo.actualizarDeuda(comisionPendiente);
        }
        return await this.saldoRepository.save(saldo);
    }
    async crearNotificacion(usuarioId, tipo, titulo, mensaje, datosAdicionales) {
        const notificacion = new notificacion_pago_entity_1.NotificacionPago();
        notificacion.usuarioId = usuarioId;
        notificacion.tipo = tipo;
        notificacion.titulo = titulo;
        notificacion.mensaje = mensaje;
        notificacion.datosAdicionales = datosAdicionales;
        return await this.notificacionRepository.save(notificacion);
    }
    async obtenerSaldoTrabajador(trabajadorId) {
        let saldo = await this.saldoRepository.findOne({
            where: { trabajadorId },
        });
        if (!saldo) {
            saldo = new saldo_trabajador_entity_1.SaldoTrabajador();
            saldo.trabajadorId = trabajadorId;
            saldo = await this.saldoRepository.save(saldo);
        }
        return saldo;
    }
    async obtenerHistorialPagos(trabajadorId, limite = 10, offset = 0) {
        const [pagos, total] = await this.pagoRepository.findAndCount({
            where: { trabajadorId },
            order: { fechaPagoServicio: 'DESC' },
            take: limite,
            skip: offset,
        });
        return { pagos, total };
    }
    async obtenerNotificaciones(usuarioId, limite = 10, offset = 0) {
        const [notificaciones, total] = await this.notificacionRepository.findAndCount({
            where: { usuarioId },
            order: { fechaCreacion: 'DESC' },
            take: limite,
            skip: offset,
        });
        return { notificaciones, total };
    }
    async marcarNotificacionLeida(notificacionId, usuarioId) {
        const result = await this.notificacionRepository.update({ id: notificacionId, usuarioId }, { leida: true });
        return (result.affected || 0) > 0;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(1, (0, typeorm_1.InjectRepository)(saldo_trabajador_entity_1.SaldoTrabajador)),
    __param(2, (0, typeorm_1.InjectRepository)(transaccion_wompi_entity_1.TransaccionWompi)),
    __param(3, (0, typeorm_1.InjectRepository)(notificacion_pago_entity_1.NotificacionPago)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        wompi_service_1.WompiService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map