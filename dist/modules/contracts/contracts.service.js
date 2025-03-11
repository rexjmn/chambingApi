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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contrato_entity_1 = require("./entities/contrato.entity");
const estado_contrato_entity_1 = require("./entities/estado-contrato.entity");
const QRCode = require("qrcode");
let ContractsService = class ContractsService {
    constructor(contratosRepository, estadosRepository) {
        this.contratosRepository = contratosRepository;
        this.estadosRepository = estadosRepository;
    }
    generateContractCode() {
        const year = new Date().getFullYear();
        const randomPart = Math.floor(10000 + Math.random() * 90000);
        return `CON-${year}-${randomPart}`;
    }
    async generateQRCode(contractCode) {
        const verificationUrl = `https://tudominio.com/verify-contract/${contractCode}`;
        return await QRCode.toDataURL(verificationUrl);
    }
    async create(createContratoDto) {
        const codigoContrato = this.generateContractCode();
        const codigoQrUrl = await this.generateQRCode(codigoContrato);
        const contrato = this.contratosRepository.create({
            ...createContratoDto,
            codigo_contrato: codigoContrato,
            codigo_qr_url: codigoQrUrl,
            estado: 'pendiente'
        });
        const contratoGuardado = await this.contratosRepository.save(contrato);
        await this.registrarEstadoContrato({
            contratoId: contratoGuardado.id,
            estadoAnterior: null,
            estadoNuevo: 'pendiente',
            usuarioId: createContratoDto.empleadorId,
            notas: 'Contrato creado'
        });
        return contratoGuardado;
    }
    async findAll(filters) {
        const queryBuilder = this.contratosRepository
            .createQueryBuilder('contrato')
            .leftJoinAndSelect('contrato.empleador', 'empleador')
            .leftJoinAndSelect('contrato.trabajador', 'trabajador')
            .leftJoinAndSelect('contrato.categoria', 'categoria')
            .leftJoinAndSelect('contrato.estados', 'estados')
            .orderBy('contrato.fecha_creacion', 'DESC');
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
    async findOne(id) {
        const contrato = await this.contratosRepository.findOne({
            where: { id },
            relations: ['empleador', 'trabajador', 'categoria', 'estados']
        });
        if (!contrato) {
            throw new common_1.NotFoundException('Contrato no encontrado');
        }
        return contrato;
    }
    async updateEstado(id, nuevoEstado, usuarioId, notas) {
        const contrato = await this.findOne(id);
        const estadoAnterior = contrato.estado;
        this.validarTransicionEstado(estadoAnterior, nuevoEstado);
        contrato.estado = nuevoEstado;
        const contratoActualizado = await this.contratosRepository.save(contrato);
        await this.registrarEstadoContrato({
            contratoId: id,
            estadoAnterior,
            estadoNuevo: nuevoEstado,
            usuarioId,
            notas
        });
        return contratoActualizado;
    }
    validarTransicionEstado(estadoActual, nuevoEstado) {
        const transicionesPermitidas = {
            'pendiente': ['en_progreso', 'cancelado'],
            'en_progreso': ['completado', 'cancelado'],
            'completado': ['cerrado'],
            'cancelado': [],
            'cerrado': []
        };
        if (!transicionesPermitidas[estadoActual]?.includes(nuevoEstado)) {
            throw new common_1.BadRequestException(`No se permite la transición de estado de ${estadoActual} a ${nuevoEstado}`);
        }
    }
    async registrarEstadoContrato(data) {
        const estadoContrato = this.estadosRepository.create(data);
        return await this.estadosRepository.save(estadoContrato);
    }
    async getHistorialEstados(contratoId) {
        return await this.estadosRepository.find({
            where: { contrato: { id: contratoId } },
            relations: ['usuario'],
            order: { fecha_cambio: 'DESC' }
        });
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contrato_entity_1.Contrato)),
    __param(1, (0, typeorm_1.InjectRepository)(estado_contrato_entity_1.EstadoContrato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map