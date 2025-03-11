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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const documento_trabajador_entity_1 = require("./entities/documento-trabajador.entity");
let DocumentsService = class DocumentsService {
    constructor(documentosRepository) {
        this.documentosRepository = documentosRepository;
    }
    async create(createDocumentoDto) {
        const existingDocument = await this.documentosRepository.findOne({
            where: {
                usuario: { id: createDocumentoDto.usuarioId },
                tipoDocumento: createDocumentoDto.tipoDocumento
            }
        });
        if (existingDocument) {
            if (existingDocument.estadoVerificacion !== 'rechazado' &&
                (!existingDocument.fecha_vencimiento ||
                    existingDocument.fecha_vencimiento > new Date())) {
                throw new common_1.BadRequestException('Ya existe un documento válido de este tipo para el usuario');
            }
            await this.documentosRepository.update(existingDocument.id, {
                estadoVerificacion: 'historico'
            });
        }
        const documento = this.documentosRepository.create({
            ...createDocumentoDto,
            estadoVerificacion: 'pendiente'
        });
        return await this.documentosRepository.save(documento);
    }
    async findAll(filters) {
        const queryBuilder = this.documentosRepository.createQueryBuilder('documento')
            .leftJoinAndSelect('documento.usuario', 'usuario')
            .leftJoinAndSelect('documento.verificador', 'verificador');
        if (filters?.usuarioId) {
            queryBuilder.andWhere('usuario.id = :usuarioId', { usuarioId: filters.usuarioId });
        }
        if (filters?.tipoDocumento) {
            queryBuilder.andWhere('documento.tipoDocumento = :tipoDocumento', { tipoDocumento: filters.tipoDocumento });
        }
        if (filters?.estadoVerificacion) {
            queryBuilder.andWhere('documento.estadoVerificacion = :estadoVerificacion', { estadoVerificacion: filters.estadoVerificacion });
        }
        queryBuilder.orderBy('documento.fecha_carga', 'DESC');
        return await queryBuilder.getMany();
    }
    async findOne(id) {
        const documento = await this.documentosRepository.findOne({
            where: { id },
            relations: ['usuario', 'verificador']
        });
        if (!documento) {
            throw new common_1.NotFoundException('Documento no encontrado');
        }
        return documento;
    }
    async verifyDocument(id, verificadorId, resultado, notas) {
        const documento = await this.findOne(id);
        if (documento.estadoVerificacion !== 'pendiente') {
            throw new common_1.BadRequestException('Este documento ya ha sido verificado');
        }
        documento.estadoVerificacion = resultado;
        documento.verificador = { id: verificadorId };
        if (resultado === 'rechazado' && notas) {
        }
        return await this.documentosRepository.save(documento);
    }
    async update(id, updateDocumentoDto) {
        const documento = await this.findOne(id);
        if (documento.estadoVerificacion === 'aprobado') {
            throw new common_1.BadRequestException('No se puede modificar un documento que ya ha sido aprobado');
        }
        Object.assign(documento, updateDocumentoDto);
        return await this.documentosRepository.save(documento);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(documento_trabajador_entity_1.DocumentoTrabajador)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map