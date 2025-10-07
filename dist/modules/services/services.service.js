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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_servicio_entity_1 = require("./entities/categoria-servicio.entity");
const tarifa_categoria_entity_1 = require("./entities/tarifa-categoria.entity");
const trabajador_categoria_entity_1 = require("./entities/trabajador-categoria.entity");
const user_entity_1 = require("../users/entities/user.entity");
const tarifa_trabajador_entity_1 = require("./entities/tarifa-trabajador.entity");
let ServicesService = class ServicesService {
    constructor(categoriasRepository, tarifasRepository, trabajadorCategoriaRepository, tarifasTrabajadorRepository, usersRepository) {
        this.categoriasRepository = categoriasRepository;
        this.tarifasRepository = tarifasRepository;
        this.trabajadorCategoriaRepository = trabajadorCategoriaRepository;
        this.tarifasTrabajadorRepository = tarifasTrabajadorRepository;
        this.usersRepository = usersRepository;
    }
    async createCategoria(createCategoriaDto) {
        const existingCategoria = await this.categoriasRepository.findOne({
            where: { nombre: createCategoriaDto.nombre }
        });
        if (existingCategoria) {
            throw new common_1.ConflictException('Ya existe una categoría con este nombre');
        }
        const categoria = this.categoriasRepository.create(createCategoriaDto);
        return await this.categoriasRepository.save(categoria);
    }
    async createTarifa(createTarifaDto) {
        const categoria = await this.categoriasRepository.findOne({
            where: { id: createTarifaDto.categoriaId }
        });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        const tarifa = this.tarifasRepository.create({
            ...createTarifaDto,
            categoria
        });
        return await this.tarifasRepository.save(tarifa);
    }
    async assignTrabajadorToCategoria(createTrabajadorCategoriaDto) {
        const existingAssignment = await this.trabajadorCategoriaRepository.findOne({
            where: {
                usuario: { id: createTrabajadorCategoriaDto.usuarioId },
                categoria: { id: createTrabajadorCategoriaDto.categoriaId }
            }
        });
        if (existingAssignment) {
            throw new common_1.ConflictException('El trabajador ya está asignado a esta categoría');
        }
        const trabajadorCategoria = this.trabajadorCategoriaRepository.create(createTrabajadorCategoriaDto);
        return await this.trabajadorCategoriaRepository.save(trabajadorCategoria);
    }
    async findAllCategorias() {
        return await this.categoriasRepository.find({
            where: { activo: true },
            relations: ['tarifas']
        });
    }
    async findCategoriaById(id) {
        const categoria = await this.categoriasRepository.findOne({
            where: { id },
            relations: ['tarifas']
        });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return categoria;
    }
    async getTrabajadoresByCategoria(categoriaId) {
        return await this.trabajadorCategoriaRepository.find({
            where: { categoria: { id: categoriaId }, verificado: true },
            relations: ['usuario']
        });
    }
    async updateCategoria(id, updateCategoriaDto) {
        const categoria = await this.findCategoriaById(id);
        Object.assign(categoria, updateCategoriaDto);
        return await this.categoriasRepository.save(categoria);
    }
    async deleteCategoria(id) {
        const categoria = await this.findCategoriaById(id);
        await this.categoriasRepository.remove(categoria);
    }
    async createTarifaTrabajador(dto) {
        const trabajador = await this.usersRepository.findOne({
            where: { id: dto.trabajadorId, tipo_usuario: 'trabajador' }
        });
        if (!trabajador) {
            throw new common_1.NotFoundException('Trabajador no encontrado');
        }
        const existingTarifa = await this.tarifasTrabajadorRepository.findOne({
            where: { trabajador: { id: dto.trabajadorId }, activo: true }
        });
        if (existingTarifa) {
            throw new common_1.ConflictException('El trabajador ya tiene tarifas activas. Usa el endpoint de actualización.');
        }
        const tarifa = this.tarifasTrabajadorRepository.create({
            ...dto,
            trabajador
        });
        return await this.tarifasTrabajadorRepository.save(tarifa);
    }
    async updateTarifaTrabajador(trabajadorId, dto) {
        const tarifa = await this.tarifasTrabajadorRepository.findOne({
            where: { trabajador: { id: trabajadorId }, activo: true }
        });
        if (!tarifa) {
            throw new common_1.NotFoundException('Tarifas no encontradas para este trabajador');
        }
        Object.assign(tarifa, dto);
        return await this.tarifasTrabajadorRepository.save(tarifa);
    }
    async getTarifasByTrabajador(trabajadorId) {
        const tarifa = await this.tarifasTrabajadorRepository.findOne({
            where: { trabajador: { id: trabajadorId }, activo: true },
            relations: ['trabajador']
        });
        return tarifa;
    }
    async deleteTarifaTrabajador(trabajadorId) {
        const tarifa = await this.getTarifasByTrabajador(trabajadorId);
        if (!tarifa) {
            throw new common_1.NotFoundException('Tarifas no encontradas');
        }
        tarifa.activo = false;
        await this.tarifasTrabajadorRepository.save(tarifa);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_servicio_entity_1.CategoriaServicio)),
    __param(1, (0, typeorm_1.InjectRepository)(tarifa_categoria_entity_1.TarifaCategoria)),
    __param(2, (0, typeorm_1.InjectRepository)(trabajador_categoria_entity_1.TrabajadorCategoria)),
    __param(3, (0, typeorm_1.InjectRepository)(tarifa_trabajador_entity_1.TarifaTrabajador)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map