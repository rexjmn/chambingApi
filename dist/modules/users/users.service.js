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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const aws_service_1 = require("../aws/aws.service");
let UsersService = class UsersService {
    constructor(usersRepository, awsService) {
        this.usersRepository = usersRepository;
        this.awsService = awsService;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const tipoUsuario = createUserDto.tipo_usuario || 'cliente';
        const user = this.usersRepository.create({
            ...createUserDto,
            tipo_usuario: tipoUsuario,
            verificado: false,
            activo: true
        });
        return await this.usersRepository.save(user);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['rolesAdministrativos', 'rolesAdministrativos.rol', 'habilidades']
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({
            where: { email },
            relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async findAll() {
        return await this.usersRepository.find({
            select: [
                'id', 'nombre', 'apellido', 'email', 'telefono', 'dui',
                'tipo_usuario', 'verificado', 'fecha_registro', 'foto_perfil',
                'foto_portada', 'activo', 'departamento', 'municipio'
            ],
            order: { fecha_registro: 'DESC' }
        });
    }
    async findAllWorkers(onlyVerified = false) {
        const query = this.usersRepository
            .createQueryBuilder('user')
            .where('user.tipo_usuario = :tipo', { tipo: 'trabajador' })
            .andWhere('user.activo = :activo', { activo: true })
            .leftJoinAndSelect('user.habilidades', 'habilidades')
            .orderBy('user.fecha_registro', 'DESC');
        if (onlyVerified) {
            query.andWhere('user.verificado = :verificado', { verificado: true });
        }
        return await query.getMany();
    }
    async getPublicProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId, activo: true },
            relations: ['habilidades', 'tarifas'],
            select: [
                'id', 'nombre', 'apellido', 'email', 'telefono',
                'departamento', 'municipio', 'biografia',
                'foto_perfil', 'foto_portada', 'tipo_usuario',
                'verificado', 'fecha_registro', 'titulo_profesional'
            ]
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const tarifasActivas = user.tarifas?.filter(t => t.activo) || [];
        return {
            status: 'success',
            data: {
                ...user,
                tarifas: tarifasActivas.length > 0 ? tarifasActivas[0] : null
            }
        };
    }
    async findPendingWorkers() {
        return await this.usersRepository.find({
            where: {
                tipo_usuario: 'trabajador',
                verificado: false,
                activo: true
            },
            order: { fecha_registro: 'ASC' }
        });
    }
    async getVerifiedWorkers(filters) {
        const query = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.habilidades', 'habilidades')
            .where('user.activo = :activo', { activo: true })
            .orderBy('user.fecha_registro', 'DESC');
        const tipoUsuario = filters.tipoUsuario || 'trabajador';
        query.andWhere('user.tipo_usuario = :tipo', { tipo: tipoUsuario });
        const verificado = filters.verificado !== undefined ? filters.verificado : true;
        query.andWhere('user.verificado = :verificado', { verificado });
        if (filters.departamento) {
            query.andWhere('user.departamento = :departamento', {
                departamento: filters.departamento
            });
        }
        if (filters.search && filters.search.trim()) {
            query.andWhere('(LOWER(user.nombre) LIKE LOWER(:search) OR ' +
                'LOWER(user.apellido) LIKE LOWER(:search) OR ' +
                'LOWER(user.titulo_profesional) LIKE LOWER(:search) OR ' +
                'LOWER(user.biografia) LIKE LOWER(:search))', { search: `%${filters.search.trim()}%` });
        }
        if (filters.categoria) {
            query.andWhere('EXISTS (' +
                'SELECT 1 FROM usuario_habilidades uh ' +
                'INNER JOIN habilidades h ON h.id = uh.habilidad_id ' +
                'WHERE uh.usuario_id = user.id ' +
                'AND (LOWER(h.nombre) LIKE LOWER(:categoria) OR LOWER(h.categoria) LIKE LOWER(:categoria))' +
                ')', { categoria: `%${filters.categoria}%` });
        }
        const users = await query.getMany();
        return users;
    }
    async verifyWorker(workerId, verified) {
        const user = await this.findOne(workerId);
        if (user.tipo_usuario !== 'trabajador') {
            throw new common_1.BadRequestException('Solo los trabajadores pueden ser verificados');
        }
        user.verificado = verified;
        return await this.usersRepository.save(user);
    }
    async changeUserType(userId, newType) {
        const user = await this.findOne(userId);
        if (newType === 'trabajador' && !user.foto_perfil) {
            throw new common_1.BadRequestException('Debe tener foto de perfil para convertirse en trabajador');
        }
        user.tipo_usuario = newType;
        if (newType === 'trabajador') {
            user.verificado = false;
        }
        return await this.usersRepository.save(user);
    }
    async update(id, updateData) {
        await this.usersRepository.update(id, updateData);
        return this.findOne(id);
    }
    async updateProfile(userId, updateData) {
        const user = await this.findOne(userId);
        const allowedFields = [
            'nombre', 'apellido', 'telefono', 'biografia',
            'departamento', 'municipio', 'direccion'
        ];
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                user[field] = updateData[field];
            }
        });
        return await this.usersRepository.save(user);
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
    }
    async updatePassword(id, hashedPassword) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        user.password = hashedPassword;
        await this.usersRepository.save(user);
    }
    async getUserRoles(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user.rolesAdministrativos
            ?.filter(ra => ra.activo)
            ?.map(ra => ra.rol.nombre) || [];
    }
    async updateProfilePhoto(userId, file) {
        const user = await this.findOne(userId);
        try {
            if (user.foto_perfil) {
                const oldKey = this.getKeyFromUrl(user.foto_perfil);
                if (oldKey) {
                    try {
                        await this.awsService.deleteFile(oldKey);
                    }
                    catch (error) {
                        console.warn(`No se pudo eliminar foto antigua: ${error.message}`);
                    }
                }
            }
            const { fileUrl } = await this.awsService.uploadFile(file);
            user.foto_perfil = fileUrl;
            user.tipo_foto_perfil = file.mimetype;
            return await this.usersRepository.save(user);
        }
        catch (error) {
            console.error('Error actualizando foto de perfil:', error);
            throw new common_1.BadRequestException(`Error actualizando foto: ${error.message}`);
        }
    }
    async updateCoverPhoto(userId, file) {
        const user = await this.findOne(userId);
        try {
            if (user.foto_portada) {
                const oldKey = this.getKeyFromUrl(user.foto_portada);
                if (oldKey) {
                    try {
                        await this.awsService.deleteFile(oldKey);
                    }
                    catch (error) {
                        console.warn(`No se pudo eliminar portada antigua: ${error.message}`);
                    }
                }
            }
            const { fileUrl } = await this.awsService.uploadFile(file, 'cover-photos');
            user.foto_portada = fileUrl;
            user.tipo_foto_portada = file.mimetype;
            return await this.usersRepository.save(user);
        }
        catch (error) {
            console.error('Error actualizando foto de portada:', error);
            throw new common_1.BadRequestException(`Error actualizando portada: ${error.message}`);
        }
    }
    async removeCoverPhoto(userId) {
        const user = await this.findOne(userId);
        try {
            if (user.foto_portada) {
                const oldKey = this.getKeyFromUrl(user.foto_portada);
                if (oldKey) {
                    try {
                        await this.awsService.deleteFile(oldKey);
                    }
                    catch (error) {
                        console.warn(`No se pudo eliminar portada: ${error.message}`);
                    }
                }
            }
            user.foto_portada = null;
            user.tipo_foto_portada = null;
            return await this.usersRepository.save(user);
        }
        catch (error) {
            console.error('Error eliminando foto de portada:', error);
            throw new common_1.BadRequestException(`Error eliminando portada: ${error.message}`);
        }
    }
    getKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.substring(1);
        }
        catch (error) {
            console.warn(`URL inválida: ${url}`);
            return null;
        }
    }
    async updateUserSkills(userId, skillIds) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['habilidades']
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (user.tipo_usuario !== 'trabajador') {
            throw new common_1.BadRequestException('Solo los trabajadores pueden tener habilidades');
        }
        const currentSkills = user.habilidades || [];
        await this.usersRepository
            .createQueryBuilder()
            .relation(user_entity_1.User, 'habilidades')
            .of(user)
            .remove(currentSkills);
        if (skillIds.length > 0) {
            await this.usersRepository
                .createQueryBuilder()
                .relation(user_entity_1.User, 'habilidades')
                .of(user)
                .add(skillIds);
        }
        return await this.findOne(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        aws_service_1.AwsService])
], UsersService);
//# sourceMappingURL=users.service.js.map