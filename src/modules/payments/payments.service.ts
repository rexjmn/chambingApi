import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago, MetodoPago, EstadoPago } from './entities/pago.entity';
import { SaldoTrabajador } from './entities/saldo-trabajador.entity';
import { TransaccionWompi } from './entities/transaccion-wompi.entity';
import { NotificacionPago, TipoNotificacion } from './entities/notificacion-pago.entity';
import { WompiService, WompiWebhookPayload } from './services/wompi.service';
import { CrearPagoDto, ProcesarPagoEfectivoDto } from './dto/crear-pago.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Pago)
    private pagoRepository: Repository<Pago>,
    @InjectRepository(SaldoTrabajador)
    private saldoRepository: Repository<SaldoTrabajador>,
    @InjectRepository(TransaccionWompi)
    private transaccionRepository: Repository<TransaccionWompi>,
    @InjectRepository(NotificacionPago)
    private notificacionRepository: Repository<NotificacionPago>,
    private wompiService: WompiService,
  ) {}

  async crearPago(dto: CrearPagoDto): Promise<Pago> {
    this.logger.log(`Creando pago para contrato: ${dto.contratoId}`);

    const pago = new Pago();
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
    } else {
      await this.procesarPagoEfectivo(pagoGuardado.id, true);
    }

    return pagoGuardado;
  }

  private async crearTransaccionWompi(pago: Pago): Promise<TransaccionWompi> {
    const referencia = `CHAMBING_${pago.id}`;
    const descripcion = `Pago de servicio - Contrato ${pago.contratoId}`;
    
    const wompiResponse = await this.wompiService.crearEnlacePago(
      pago.montoServicio,
      descripcion,
      referencia,
      `${process.env.APP_URL}/api/payments/webhook`,
    );

    if (!wompiResponse.success) {
      throw new Error(`Error creando pago Wompi: ${wompiResponse.error}`);
    }

    const transaccion = new TransaccionWompi();
    transaccion.pagoId = pago.id;
    transaccion.wompiTransactionId = wompiResponse.transaction_id || '';
    transaccion.wompiReference = wompiResponse.reference || '';
    transaccion.estadoWompi = wompiResponse.status || '';
    transaccion.monto = pago.montoServicio;
    transaccion.metodoPagoWompi = pago.metodoPago === MetodoPago.WOMPI_BITCOIN ? 'BITCOIN' : 'CARD';

    return await this.transaccionRepository.save(transaccion);
  }

  async procesarPagoEfectivo(pagoId: string, confirmado: boolean, notas?: string): Promise<Pago> {
    const pago = await this.pagoRepository.findOne({
      where: { id: pagoId },
    });

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    if (confirmado) {
      pago.estadoPago = EstadoPago.COMPLETADO;
      pago.notas = notas || '';

      await this.actualizarSaldoTrabajador(
        pago.trabajadorId,
        pago.montoTrabajador,
        pago.comisionPlataforma,
      );

      await this.crearNotificacion(
        pago.trabajadorId,
        TipoNotificacion.COMISION_PENDIENTE,
        'Comisión pendiente de pago',
        `Tienes $${pago.comisionPlataforma} en comisiones pendientes por el servicio completado.`,
        { pagoId: pago.id, monto: pago.comisionPlataforma },
      );
    } else {
      pago.estadoPago = EstadoPago.FALLIDO;
      pago.notas = notas || 'Pago en efectivo no confirmado';
    }

    return await this.pagoRepository.save(pago);
  }

  async manejarWebhookWompi(payload: WompiWebhookPayload): Promise<void> {
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
      pago.estadoPago = EstadoPago.COMPLETADO;
      pago.referenciaExterna = payload.transaction_id;

      await this.actualizarSaldoTrabajador(
        pago.trabajadorId,
        pago.montoTrabajador,
        0,
      );

      pago.comisionPagada = true;
      pago.fechaPagoComision = new Date();

      await this.crearNotificacion(
        pago.trabajadorId,
        TipoNotificacion.PAGO_RECIBIDO,
        'Pago recibido exitosamente',
        `Has recibido $${pago.montoTrabajador} por tu servicio completado.`,
        { pagoId: pago.id, metodo: payload.payment_method },
      );
    } else if (payload.status === 'DECLINED') {
      pago.estadoPago = EstadoPago.FALLIDO;
      
      await this.crearNotificacion(
        pago.trabajadorId,
        TipoNotificacion.PAGO_FALLIDO,
        'Pago fallido',
        'El pago del cliente fue rechazado. Por favor, contacta al cliente para resolver el problema.',
        { pagoId: pago.id, razon: 'Pago rechazado por Wompi' },
      );
    }

    await this.pagoRepository.save(pago);
  }

  private async actualizarSaldoTrabajador(
    trabajadorId: string,
    montoGanado: number,
    comisionPendiente: number,
  ): Promise<SaldoTrabajador> {
    let saldo = await this.saldoRepository.findOne({
      where: { trabajadorId },
    });

    if (!saldo) {
      saldo = new SaldoTrabajador();
      saldo.trabajadorId = trabajadorId;
    }

    saldo.saldoDisponible += montoGanado;
    saldo.totalGanado += montoGanado;
    
    if (comisionPendiente > 0) {
      saldo.actualizarDeuda(comisionPendiente);
    }

    return await this.saldoRepository.save(saldo);
  }

  private async crearNotificacion(
    usuarioId: string,
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    datosAdicionales?: any,
  ): Promise<NotificacionPago> {
    const notificacion = new NotificacionPago();
    notificacion.usuarioId = usuarioId;
    notificacion.tipo = tipo;
    notificacion.titulo = titulo;
    notificacion.mensaje = mensaje;
    notificacion.datosAdicionales = datosAdicionales;

    return await this.notificacionRepository.save(notificacion);
  }

  async obtenerSaldoTrabajador(trabajadorId: string): Promise<SaldoTrabajador> {
    let saldo = await this.saldoRepository.findOne({
      where: { trabajadorId },
    });

    if (!saldo) {
      saldo = new SaldoTrabajador();
      saldo.trabajadorId = trabajadorId;
      saldo = await this.saldoRepository.save(saldo);
    }

    return saldo;
  }

  async obtenerHistorialPagos(
    trabajadorId: string,
    limite: number = 10,
    offset: number = 0,
  ): Promise<{ pagos: Pago[]; total: number }> {
    const [pagos, total] = await this.pagoRepository.findAndCount({
      where: { trabajadorId },
      order: { fechaPagoServicio: 'DESC' },
      take: limite,
      skip: offset,
    });

    return { pagos, total };
  }

  async obtenerNotificaciones(
    usuarioId: string,
    limite: number = 10,
    offset: number = 0,
  ): Promise<{ notificaciones: NotificacionPago[]; total: number }> {
    const [notificaciones, total] = await this.notificacionRepository.findAndCount({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
      take: limite,
      skip: offset,
    });

    return { notificaciones, total };
  }

  async marcarNotificacionLeida(notificacionId: string, usuarioId: string): Promise<boolean> {
    const result = await this.notificacionRepository.update(
      { id: notificacionId, usuarioId },
      { leida: true }
    );

    return (result.affected || 0) > 0;
  }
}