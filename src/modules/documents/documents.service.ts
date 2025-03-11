import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoTrabajador } from './entities/documento-trabajador.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentoTrabajador)
    private documentosRepository: Repository<DocumentoTrabajador>
  ) {}

  async create(createDocumentoDto: CreateDocumentoDto): Promise<DocumentoTrabajador> {
    // Verificamos si ya existe un documento del mismo tipo para este usuario
    const existingDocument = await this.documentosRepository.findOne({
      where: {
        usuario: { id: createDocumentoDto.usuarioId },
        tipoDocumento: createDocumentoDto.tipoDocumento
      }
    });

    // Si existe un documento del mismo tipo, verificamos su estado
    if (existingDocument) {
      // Permitimos actualizar solo si el documento anterior está vencido o rechazado
      if (existingDocument.estadoVerificacion !== 'rechazado' && 
          (!existingDocument.fecha_vencimiento || 
           existingDocument.fecha_vencimiento > new Date())) {
        throw new BadRequestException(
          'Ya existe un documento válido de este tipo para el usuario'
        );
      }
      // Marcamos el documento anterior como histórico
      await this.documentosRepository.update(existingDocument.id, {
        estadoVerificacion: 'historico'
      });
    }

    // Creamos el nuevo documento
    const documento = this.documentosRepository.create({
      ...createDocumentoDto,
      estadoVerificacion: 'pendiente'
    });

    return await this.documentosRepository.save(documento);
  }

  async findAll(filters?: {
    usuarioId?: string;
    tipoDocumento?: string;
    estadoVerificacion?: string;
  }): Promise<DocumentoTrabajador[]> {
    // Construimos la consulta base
    const queryBuilder = this.documentosRepository.createQueryBuilder('documento')
      .leftJoinAndSelect('documento.usuario', 'usuario')
      .leftJoinAndSelect('documento.verificador', 'verificador');

    // Aplicamos los filtros si existen
    if (filters?.usuarioId) {
      queryBuilder.andWhere('usuario.id = :usuarioId', { usuarioId: filters.usuarioId });
    }
    if (filters?.tipoDocumento) {
      queryBuilder.andWhere('documento.tipoDocumento = :tipoDocumento', { tipoDocumento: filters.tipoDocumento });
    }
    if (filters?.estadoVerificacion) {
      queryBuilder.andWhere('documento.estadoVerificacion = :estadoVerificacion', { estadoVerificacion: filters.estadoVerificacion });
    }

    // Ordenamos por fecha de carga descendente
    queryBuilder.orderBy('documento.fecha_carga', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<DocumentoTrabajador> {
    const documento = await this.documentosRepository.findOne({
      where: { id },
      relations: ['usuario', 'verificador']
    });

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    return documento;
  }

  async verifyDocument(
    id: string,
    verificadorId: string,
    resultado: 'aprobado' | 'rechazado',
    notas?: string
  ): Promise<DocumentoTrabajador> {
    const documento = await this.findOne(id);

    if (documento.estadoVerificacion !== 'pendiente') {
      throw new BadRequestException('Este documento ya ha sido verificado');
    }

    // Actualizamos el estado del documento
    documento.estadoVerificacion = resultado;
    documento.verificador = { id: verificadorId } as any;
    
    // Si el documento fue rechazado, registramos el motivo
    if (resultado === 'rechazado' && notas) {
      // Aquí podrías agregar un campo para notas de verificación
      // o crear una tabla separada para el historial de verificaciones
    }

    return await this.documentosRepository.save(documento);
  }

  async update(
    id: string, 
    updateDocumentoDto: UpdateDocumentoDto
  ): Promise<DocumentoTrabajador> {
    const documento = await this.findOne(id);

    // Solo permitimos actualizar documentos pendientes o rechazados
    if (documento.estadoVerificacion === 'aprobado') {
      throw new BadRequestException(
        'No se puede modificar un documento que ya ha sido aprobado'
      );
    }

    Object.assign(documento, updateDocumentoDto);
    return await this.documentosRepository.save(documento);
  }
}