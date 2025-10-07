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
    generatePIN() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async generateQRCode(contratoData) {
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
    calcularMontoTrabajador(montoTotal, comisionPorcentaje = 10) {
        const comision = montoTotal * (comisionPorcentaje / 100);
        return montoTotal - comision;
    }
    async create(createContratoDto) {
        if (createContratoDto.empleadorId === createContratoDto.trabajadorId) {
            throw new common_1.BadRequestException('El empleador y el trabajador no pueden ser la misma persona');
        }
        const codigoContrato = this.generateContractCode();
        const pinActivacion = this.generatePIN();
        const montoTrabajador = this.calcularMontoTrabajador(createContratoDto.monto);
        const contrato = this.contratosRepository.create({
            codigo_contrato: codigoContrato,
            pin_activacion: pinActivacion,
            empleador: { id: createContratoDto.empleadorId },
            trabajador: { id: createContratoDto.trabajadorId },
            categoria: { id: createContratoDto.categoriaId },
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
    async activarContrato(activarDto, usuarioId, ip) {
        let contrato = null;
        if (activarDto.metodoActivacion === 'pin') {
            if (!activarDto.codigoContrato || !activarDto.pin) {
                throw new common_1.BadRequestException('Código de contrato y PIN son requeridos');
            }
            contrato = await this.contratosRepository.findOne({
                where: {
                    codigo_contrato: activarDto.codigoContrato,
                    pin_activacion: activarDto.pin
                },
                relations: ['empleador', 'trabajador', 'categoria']
            });
        }
        else if (activarDto.metodoActivacion === 'qr') {
            if (!activarDto.qrData) {
                throw new common_1.BadRequestException('Datos del QR son requeridos');
            }
            try {
                const qrData = JSON.parse(Buffer.from(activarDto.qrData, 'base64').toString('utf-8'));
                contrato = await this.contratosRepository.findOne({
                    where: {
                        id: qrData.id,
                        codigo_contrato: qrData.codigo_contrato,
                        pin_activacion: qrData.pin
                    },
                    relations: ['empleador', 'trabajador', 'categoria']
                });
            }
            catch (error) {
                throw new common_1.BadRequestException('Código QR inválido o corrupto');
            }
        }
        if (!contrato) {
            throw new common_1.NotFoundException('Contrato no encontrado o PIN/QR incorrecto');
        }
        if (!contrato.puedeSerActivado()) {
            throw new common_1.BadRequestException(`El contrato no puede ser activado. Estado actual: ${contrato.estado}`);
        }
        const esEmpleador = contrato.empleador.id === usuarioId;
        const esTrabajador = contrato.trabajador.id === usuarioId;
        if (!esEmpleador && !esTrabajador) {
            throw new common_1.UnauthorizedException('No tienes permiso para activar este contrato');
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
    async completarContrato(contratoId, usuarioId, notas) {
        const contrato = await this.findOne(contratoId);
        if (!contrato.puedeSerCompletado()) {
            throw new common_1.BadRequestException(`El contrato no puede ser completado. Estado actual: ${contrato.estado}`);
        }
        if (contrato.trabajador.id !== usuarioId) {
            throw new common_1.UnauthorizedException('Solo el trabajador puede marcar el contrato como completado');
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
    async cerrarContrato(contratoId, usuarioId, notas) {
        const contrato = await this.findOne(contratoId);
        if (contrato.estado !== 'completado') {
            throw new common_1.BadRequestException('Solo se pueden cerrar contratos completados');
        }
        if (contrato.empleador.id !== usuarioId) {
            throw new common_1.UnauthorizedException('Solo el empleador puede cerrar el contrato');
        }
        const estadoAnterior = contrato.estado;
        contrato.estado = 'cerrado';
        contrato.fecha_cierre = new Date();
        if (contrato.metodo_pago === 'tarjeta') {
            contrato.estado_pago = 'liberado';
        }
        else {
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
    async cancelarContrato(contratoId, usuarioId, motivo) {
        const contrato = await this.findOne(contratoId);
        if (!contrato.puedeSerCancelado()) {
            throw new common_1.BadRequestException(`El contrato no puede ser cancelado. Estado actual: ${contrato.estado}`);
        }
        const esEmpleador = contrato.empleador.id === usuarioId;
        const esTrabajador = contrato.trabajador.id === usuarioId;
        if (!esEmpleador && !esTrabajador) {
            throw new common_1.UnauthorizedException('No tienes permiso para cancelar este contrato');
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
    async findAll(filters) {
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
    async findByCodigoContrato(codigo) {
        const contrato = await this.contratosRepository.findOne({
            where: { codigo_contrato: codigo },
            relations: ['empleador', 'trabajador', 'categoria']
        });
        if (!contrato) {
            throw new common_1.NotFoundException('Contrato no encontrado');
        }
        return contrato;
    }
    async getHistorialEstados(contratoId) {
        return await this.estadosRepository.find({
            where: { contrato: { id: contratoId } },
            relations: ['usuario'],
            order: { fecha_cambio: 'DESC' }
        });
    }
    async registrarEstadoContrato(data) {
        const estadoContrato = this.estadosRepository.create({
            contrato: { id: data.contratoId },
            estado_anterior: data.estadoAnterior,
            estado_nuevo: data.estadoNuevo,
            usuario: { id: data.usuarioId },
            notas: data.notas
        });
        return await this.estadosRepository.save(estadoContrato);
    }
    async getContratosCerradosPorTrabajador(trabajadorId) {
        return await this.contratosRepository.find({
            where: {
                trabajador: { id: trabajadorId },
                estado: 'cerrado'
            },
            relations: ['empleador', 'categoria']
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