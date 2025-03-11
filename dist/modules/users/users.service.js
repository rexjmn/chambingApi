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
    async updateProfilePhoto(userId, file) {
        const user = await this.findOne(userId);
        try {
            if (user.foto_perfil) {
                const oldKey = this.getKeyFromUrl(user.foto_perfil);
                if (oldKey) {
                    await this.awsService.deleteFile(oldKey);
                }
            }
            const { fileUrl } = await this.awsService.uploadFile(file);
            user.foto_perfil = fileUrl;
            return await this.usersRepository.save(user);
        }
        catch (error) {
            throw new common_1.BadRequestException('Error actualizando foto de perfil');
        }
    }
    getKeyFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.substring(1);
        }
        catch {
            return null;
        }
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        if (createUserDto.tipo_usuario === 'trabajador' && !createUserDto.foto_perfil) {
            throw new common_1.BadRequestException('La foto de perfil es obligatoria para trabajadores');
        }
        const user = this.usersRepository.create({
            ...createUserDto,
            tipo_usuario: createUserDto.tipo_usuario || 'regular',
            activo: true
        });
        return await this.usersRepository.save(user);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
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
            .filter(ra => ra.activo)
            .map(ra => ra.rol.nombre);
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