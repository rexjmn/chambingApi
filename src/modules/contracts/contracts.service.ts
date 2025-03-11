import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from './entities/contrato.entity';
import { EstadoContrato } from './entities/estado-contrato.entity';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contrato)
    private contratosRepository: Repository<Contrato>,
    @InjectRepository(EstadoContrato)
    private estadosRepository: Repository<EstadoContrato>
  ) {}

  // Método para generar un código de contrato único
  private generateContractCode(): string {
    // Generamos un código con formato: CON-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return `CON-${year}-${randomPart}`;
  }

  // Método para generar el código QR del contrato
  private async generateQRCode(contractCode: string): Promise<string> {
    // El QR contendrá una URL a la verificación del contrato
    const verificationUrl = `https://tudominio.com/verify-contract/${contractCode}`;
    return await QRCode.toDataURL(verificationUrl);
  }

  async create(createContratoDto: CreateContratoDto): Promise<Contrato> {
    // Generamos el código único del contrato
    const codigoContrato = this.generateContractCode();
    
    // Generamos el código QR
    const codigoQrUrl = await this.generateQRCode(codigoContrato);

    // Creamos el contrato con sus estados iniciales
    const contrato = this.contratosRepository.create({
      ...createContratoDto,
      codigo_contrato: codigoContrato,
      codigo_qr_url: codigoQrUrl,
      estado: 'pendiente'
    });

    // Guardamos el contrato
    const contratoGuardado = await this.contratosRepository.save(contrato);

    // Registramos el estado inicial
    await this.registrarEstadoContrato({
      contratoId: contratoGuardado.id,
      estadoAnterior: null,
      estadoNuevo: 'pendiente',
      usuarioId: createContratoDto.empleadorId,
      notas: 'Contrato creado'
    });

    return contratoGuardado;
  }

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
      .leftJoinAndSelect('contrato.estados', 'estados')
      .orderBy('contrato.fecha_creacion', 'DESC');

    // Aplicamos los filtros
    if (filters?.empleadorId) {
      queryBuilder.andWhere('empleador.id = :empleadorId', { empleadorId: filters.empleadorId });
    }
    if (filters?.trabajadorId) {
      queryBuilder.andWhere('trabajador.id = :trabajadorId', { trabajadorId: filters.trabajadorId });
    }
    if (filters?.estado) {
      queryBuilder.andWhere('contrato.estado = :estado', { estado: filters.estado });
    }
    if (filters?.fechaInicio) {
      queryBuilder.andWhere('contrato.fecha_inicio >= :fechaInicio', { fechaInicio: filters.fechaInicio });
    }
    if (filters?.fechaFin) {
      queryBuilder.andWhere('contrato.fecha_inicio <= :fechaFin', { fechaFin: filters.fechaFin });
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

  async updateEstado(
    id: string,
    nuevoEstado: string,
    usuarioId: string,
    notas?: string
  ): Promise<Contrato> {
    const contrato = await this.findOne(id);
    const estadoAnterior = contrato.estado;

    // Validamos la transición de estado
    this.validarTransicionEstado(estadoAnterior, nuevoEstado);

    // Actualizamos el estado del contrato
    contrato.estado = nuevoEstado;
    const contratoActualizado = await this.contratosRepository.save(contrato);

    // Registramos el cambio de estado
    await this.registrarEstadoContrato({
      contratoId: id,
      estadoAnterior,
      estadoNuevo: nuevoEstado,
      usuarioId,
      notas
    });

    return contratoActualizado;
  }

  private validarTransicionEstado(estadoActual: string, nuevoEstado: string): void {
    // Definimos las transiciones permitidas
    const transicionesPermitidas = {
      'pendiente': ['en_progreso', 'cancelado'],
      'en_progreso': ['completado', 'cancelado'],
      'completado': ['cerrado'],
      'cancelado': [],
      'cerrado': []
    };

    if (!transicionesPermitidas[estadoActual]?.includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se permite la transición de estado de ${estadoActual} a ${nuevoEstado}`
      );
    }
  }

  private async registrarEstadoContrato(data: {
    contratoId: string;
    estadoAnterior: string | null; // Modificamos para aceptar null
    estadoNuevo: string;
    usuarioId: string;
    notas?: string;
  }): Promise<EstadoContrato> {
    const estadoContrato = this.estadosRepository.create(data);
    return await this.estadosRepository.save(estadoContrato);
  }

  async getHistorialEstados(contratoId: string): Promise<EstadoContrato[]> {
    return await this.estadosRepository.find({
      where: { contrato: { id: contratoId } },
      relations: ['usuario'],
      order: { fecha_cambio: 'DESC' }
    });
  }
}