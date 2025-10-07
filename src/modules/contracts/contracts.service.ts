// src/modules/contracts/contracts.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from './entities/contrato.entity';
import { EstadoContrato } from './entities/estado-contrato.entity';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { ActivarContratoDto } from './dto/activar-contrato.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contrato)
    private contratosRepository: Repository<Contrato>,
    @InjectRepository(EstadoContrato)
    private estadosRepository: Repository<EstadoContrato>
  ) {}

  // ========== MÉTODOS PRIVADOS DE GENERACIÓN ==========

  private generateContractCode(): string {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `CON-${year}-${randomPart}`;
  }

  private generatePIN(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateQRCode(contratoData: {
    codigo: string;
    pin: string;
    contratoId: string;
  }): Promise<string> {
    const payload = {
      codigo_contrato: contratoData.codigo,
      pin: contratoData.pin,
      id: contratoData.contratoId,
      timestamp: Date.now()
    };

    const dataString = JSON.stringify(payload);
    const qrData = Buffer.from(dataString).toString('base64');

    return await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2
    });
  }

  private calcularMontoTrabajador(
    montoTotal: number, 
    comisionPorcentaje: number = 10
  ): number {
    const comision = montoTotal * (comisionPorcentaje / 100);
    return montoTotal - comision;
  }

  // ========== CREAR CONTRATO ==========

  async create(createContratoDto: CreateContratoDto): Promise<Contrato> {
    if (createContratoDto.empleadorId === createContratoDto.trabajadorId) {
      throw new BadRequestException(
        'El empleador y el trabajador no pueden ser la misma persona'
      );
    }

    const codigoContrato = this.generateContractCode();
    const pinActivacion = this.generatePIN();
    const montoTrabajador = this.calcularMontoTrabajador(createContratoDto.monto);

    const contrato = this.contratosRepository.create({
      codigo_contrato: codigoContrato,
      pin_activacion: pinActivacion,
      empleador: { id: createContratoDto.empleadorId } as any,
      trabajador: { id: createContratoDto.trabajadorId } as any,
      categoria: { id: createContratoDto.categoriaId } as any,
      fecha_inicio_programada: createContratoDto.fechaInicio,
      fecha_fin_programada: createContratoDto.fechaFin,
      detalles_servicio: createContratoDto.detallesServicio,
      terminos_condiciones: createContratoDto.terminosCondiciones,
      monto_total: createContratoDto.monto,
      monto_trabajador: montoTrabajador,
      metodo_pago: createContratoDto.metodoPago || 'efectivo',
      estado: 'pendiente_activacion',
      estado_pago: 'pendiente'
    });

    const contratoGuardado = await this.contratosRepository.save(contrato);

    const qrCodeUrl = await this.generateQRCode({
      codigo: codigoContrato,
      pin: pinActivacion,
      contratoId: contratoGuardado.id
    });

    contratoGuardado.codigo_qr_url = qrCodeUrl;
    await this.contratosRepository.save(contratoGuardado);

    await this.registrarEstadoContrato({
      contratoId: contratoGuardado.id,
      estadoAnterior: null,
      estadoNuevo: 'pendiente_activacion',
      usuarioId: createContratoDto.empleadorId,
      notas: 'Contrato creado y pendiente de activación'
    });

    return contratoGuardado;
  }

  // ========== ACTIVAR CONTRATO ==========

  async activarContrato(
    activarDto: ActivarContratoDto,
    usuarioId: string,
    ip?: string
  ): Promise<Contrato> {
    let contrato: Contrato | null = null;

    // Buscar contrato según el método de activación
    if (activarDto.metodoActivacion === 'pin') {
      if (!activarDto.codigoContrato || !activarDto.pin) {
        throw new BadRequestException('Código de contrato y PIN son requeridos');
      }
      
      contrato = await this.contratosRepository.findOne({
        where: { 
          codigo_contrato: activarDto.codigoContrato,
          pin_activacion: activarDto.pin 
        },
        relations: ['empleador', 'trabajador', 'categoria']
      });
    } else if (activarDto.metodoActivacion === 'qr') {
      if (!activarDto.qrData) {
        throw new BadRequestException('Datos del QR son requeridos');
      }
      
      try {
        const qrData = JSON.parse(
          Buffer.from(activarDto.qrData, 'base64').toString('utf-8')
        );
        
        contrato = await this.contratosRepository.findOne({
          where: { 
            id: qrData.id,
            codigo_contrato: qrData.codigo_contrato,
            pin_activacion: qrData.pin
          },
          relations: ['empleador', 'trabajador', 'categoria']
        });
      } catch (error) {
        throw new BadRequestException('Código QR inválido o corrupto');
      }
    }

    if (!contrato) {
      throw new NotFoundException('Contrato no encontrado o PIN/QR incorrecto');
    }

    if (!contrato.puedeSerActivado()) {
      throw new BadRequestException(
        `El contrato no puede ser activado. Estado actual: ${contrato.estado}`
      );
    }

    const esEmpleador = contrato.empleador.id === usuarioId;
    const esTrabajador = contrato.trabajador.id === usuarioId;

    if (!esEmpleador && !esTrabajador) {
      throw new UnauthorizedException(
        'No tienes permiso para activar este contrato'
      );
    }

    const estadoAnterior = contrato.estado;
    contrato.estado = 'activo';
    contrato.fecha_activacion = new Date();
    contrato.activado_por = esEmpleador ? 'empleador' : 'trabajador';
    contrato.metodo_activacion = activarDto.metodoActivacion;
    contrato.ip_activacion = ip || null;

    if (contrato.metodo_pago === 'tarjeta') {
      contrato.estado_pago = 'en_hold';
    }

    const contratoActivado = await this.contratosRepository.save(contrato);

    await this.registrarEstadoContrato({
      contratoId: contrato.id,
      estadoAnterior,
      estadoNuevo: 'activo',
      usuarioId,
      notas: `Contrato activado por ${contrato.activado_por} usando ${contrato.metodo_activacion}`
    });

    return contratoActivado;
  }

  // ========== COMPLETAR CONTRATO ==========

  async completarContrato(
    contratoId: string,
    usuarioId: string,
    notas?: string
  ): Promise<Contrato> {
    const contrato = await this.findOne(contratoId);

    if (!contrato.puedeSerCompletado()) {
      throw new BadRequestException(
        `El contrato no puede ser completado. Estado actual: ${contrato.estado}`
      );
    }

    if (contrato.trabajador.id !== usuarioId) {
      throw new UnauthorizedException(
        'Solo el trabajador puede marcar el contrato como completado'
      );
    }

    const estadoAnterior = contrato.estado;
    contrato.estado = 'completado';
    contrato.fecha_completado = new Date();

    const contratoActualizado = await this.contratosRepository.save(contrato);

    await this.registrarEstadoContrato({
      contratoId,
      estadoAnterior,
      estadoNuevo: 'completado',
      usuarioId,
      notas: notas || 'Trabajo completado por el trabajador'
    });

    return contratoActualizado;
  }

  // ========== CERRAR CONTRATO (LIBERAR PAGO) ==========

  async cerrarContrato(
    contratoId: string,
    usuarioId: string,
    notas?: string
  ): Promise<Contrato> {
    const contrato = await this.findOne(contratoId);

    if (contrato.estado !== 'completado') {
      throw new BadRequestException(
        'Solo se pueden cerrar contratos completados'
      );
    }

    if (contrato.empleador.id !== usuarioId) {
      throw new UnauthorizedException(
        'Solo el empleador puede cerrar el contrato'
      );
    }

    const estadoAnterior = contrato.estado;
    contrato.estado = 'cerrado';
    contrato.fecha_cierre = new Date();

    if (contrato.metodo_pago === 'tarjeta') {
      contrato.estado_pago = 'liberado';
    } else {
      contrato.estado_pago = 'completado';
    }

    const contratoCerrado = await this.contratosRepository.save(contrato);

    await this.registrarEstadoContrato({
      contratoId,
      estadoAnterior,
      estadoNuevo: 'cerrado',
      usuarioId,
      notas: notas || 'Contrato cerrado y pago liberado'
    });

    return contratoCerrado;
  }

  // ========== CANCELAR CONTRATO ==========

  async cancelarContrato(
    contratoId: string,
    usuarioId: string,
    motivo: string
  ): Promise<Contrato> {
    const contrato = await this.findOne(contratoId);

    if (!contrato.puedeSerCancelado()) {
      throw new BadRequestException(
        `El contrato no puede ser cancelado. Estado actual: ${contrato.estado}`
      );
    }

    const esEmpleador = contrato.empleador.id === usuarioId;
    const esTrabajador = contrato.trabajador.id === usuarioId;

    if (!esEmpleador && !esTrabajador) {
      throw new UnauthorizedException(
        'No tienes permiso para cancelar este contrato'
      );
    }

    const estadoAnterior = contrato.estado;
    contrato.estado = 'cancelado';

    if (contrato.estado_pago === 'en_hold') {
      contrato.estado_pago = 'reembolsado';
    }

    const contratoCancelado = await this.contratosRepository.save(contrato);

    await this.registrarEstadoContrato({
      contratoId,
      estadoAnterior,
      estadoNuevo: 'cancelado',
      usuarioId,
      notas: `Cancelado por ${esEmpleador ? 'empleador' : 'trabajador'}. Motivo: ${motivo}`
    });

    return contratoCancelado;
  }

  // ========== CONSULTAS ==========

  async findAll(filters?: {
    empleadorId?: string;
    trabajadorId?: string;
    estado?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
  }): Promise<Contrato[]> {
    const queryBuilder = this.contratosRepository
      .createQueryBuilder('contrato')
      .leftJoinAndSelect('contrato.empleador', 'empleador')
      .leftJoinAndSelect('contrato.trabajador', 'trabajador')
      .leftJoinAndSelect('contrato.categoria', 'categoria')
      .orderBy('contrato.fecha_creacion', 'DESC');

    if (filters?.empleadorId) {
      queryBuilder.andWhere('empleador.id = :empleadorId', { 
        empleadorId: filters.empleadorId 
      });
    }
    if (filters?.trabajadorId) {
      queryBuilder.andWhere('trabajador.id = :trabajadorId', { 
        trabajadorId: filters.trabajadorId 
      });
    }
    if (filters?.estado) {
      queryBuilder.andWhere('contrato.estado = :estado', { 
        estado: filters.estado 
      });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Contrato> {
    const contrato = await this.contratosRepository.findOne({
      where: { id },
      relations: ['empleador', 'trabajador', 'categoria', 'estados']
    });

    if (!contrato) {
      throw new NotFoundException('Contrato no encontrado');
    }

    return contrato;
  }

  async findByCodigoContrato(codigo: string): Promise<Contrato> {
    const contrato = await this.contratosRepository.findOne({
      where: { codigo_contrato: codigo },
      relations: ['empleador', 'trabajador', 'categoria']
    });

    if (!contrato) {
      throw new NotFoundException('Contrato no encontrado');
    }

    return contrato;
  }

  // ========== HISTORIAL DE ESTADOS ==========

  async getHistorialEstados(contratoId: string): Promise<EstadoContrato[]> {
    return await this.estadosRepository.find({
      where: { contrato: { id: contratoId } },
      relations: ['usuario'],
      order: { fecha_cambio: 'DESC' }
    });
  }

  private async registrarEstadoContrato(data: {
    contratoId: string;
    estadoAnterior: string | null;
    estadoNuevo: string;
    usuarioId: string;
    notas?: string;
  }): Promise<EstadoContrato> {
    const estadoContrato = this.estadosRepository.create({
      contrato: { id: data.contratoId } as any,
      estado_anterior: data.estadoAnterior,
      estado_nuevo: data.estadoNuevo,
      usuario: { id: data.usuarioId } as any,
      notas: data.notas
    });
    
    return await this.estadosRepository.save(estadoContrato);
  }

  // ========== ESTADÍSTICAS ==========

  async getContratosCerradosPorTrabajador(trabajadorId: string): Promise<Contrato[]> {
    return await this.contratosRepository.find({
      where: {
        trabajador: { id: trabajadorId },
        estado: 'cerrado'
      },
      relations: ['empleador', 'categoria']
    });
  }
}