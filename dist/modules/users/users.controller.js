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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const platform_express_1 = require("@nestjs/platform-express");
const create_user_dto_1 = require("./dto/create-user.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const bcrypt = require("bcrypt");
const imageFileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new common_1.BadRequestException('Solo se permiten imágenes'), false);
    }
    else {
        cb(null, true);
    }
};
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword
        });
        const { password, ...result } = user;
        return {
            status: 'success',
            message: 'Usuario registrado exitosamente',
            data: result
        };
    }
    async getPublicProfile(id) {
        try {
            const user = await this.usersService.findOne(id);
            if (!user.activo) {
                throw new common_1.NotFoundException('Usuario no disponible');
            }
            const publicData = {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                foto_perfil: user.foto_perfil,
                foto_portada: user.foto_portada,
                biografia: user.biografia,
                departamento: user.departamento,
                municipio: user.municipio,
                tipo_usuario: user.tipo_usuario,
                verificado: user.tipo_usuario === 'trabajador' ? user.verificado : undefined,
                fecha_registro: user.fecha_registro,
                habilidades: user.habilidades || [],
                telefono: (user.tipo_usuario === 'trabajador' && user.verificado) ? user.telefono : undefined
            };
            return await this.usersService.getPublicProfile(id);
        }
        catch (error) {
            console.error('Error fetching public profile:', error);
            throw new common_1.NotFoundException('Perfil no encontrado');
        }
    }
    async getProfile(req) {
        const user = await this.usersService.findOne(req.user.id);
        const { password, ...result } = user;
        return {
            status: 'success',
            data: result
        };
    }
    async getMe(req) {
        try {
            const user = await this.usersService.findOne(req.user.id);
            const { password, ...userWithoutPassword } = user;
            const roles = await this.usersService.getUserRoles(req.user.id);
            return {
                status: 'success',
                data: {
                    ...userWithoutPassword,
                    roles,
                    tipo_usuario: user.tipo_usuario,
                    verificado: user.verificado,
                    foto_perfil: user.foto_perfil || null,
                    tipo_foto_perfil: user.tipo_foto_perfil || null,
                    foto_portada: user.foto_portada || null,
                    tipo_foto_portada: user.tipo_foto_portada || null,
                    habilidades: user.habilidades || []
                }
            };
        }
        catch (error) {
            console.error('Error in getMe:', error);
            throw new common_1.BadRequestException('Error obteniendo datos del usuario');
        }
    }
    async updateProfile(req, updateData) {
        try {
            const updatedUser = await this.usersService.updateProfile(req.user.id, updateData);
            const { password, ...result } = updatedUser;
            return {
                status: 'success',
                message: 'Perfil actualizado exitosamente',
                data: result
            };
        }
        catch (error) {
            console.error('Error updating profile:', error);
            throw new common_1.BadRequestException('Error actualizando perfil');
        }
    }
    async changeUserType(req, body) {
        try {
            const updatedUser = await this.usersService.changeUserType(req.user.id, body.tipo_usuario);
            const { password, ...result } = updatedUser;
            return {
                status: 'success',
                message: `Tipo de usuario cambiado a ${body.tipo_usuario}`,
                data: result
            };
        }
        catch (error) {
            console.error('Error changing user type:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateProfilePhoto(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No se ha proporcionado ninguna imagen');
        }
        try {
            const updatedUser = await this.usersService.updateProfilePhoto(req.user.id, file);
            return {
                status: 'success',
                message: 'Foto de perfil actualizada exitosamente',
                data: {
                    id: updatedUser.id,
                    foto_perfil: updatedUser.foto_perfil,
                    tipo_foto_perfil: updatedUser.tipo_foto_perfil,
                    updatedAt: new Date()
                }
            };
        }
        catch (error) {
            console.error('Error updating profile photo:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateCoverPhoto(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No se ha proporcionado ninguna imagen');
        }
        try {
            const updatedUser = await this.usersService.updateCoverPhoto(req.user.id, file);
            return {
                status: 'success',
                message: 'Foto de portada actualizada exitosamente',
                data: {
                    id: updatedUser.id,
                    foto_portada: updatedUser.foto_portada,
                    tipo_foto_portada: updatedUser.tipo_foto_portada,
                    updatedAt: new Date()
                }
            };
        }
        catch (error) {
            console.error('Error updating cover photo:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async removeCoverPhoto(req) {
        try {
            const updatedUser = await this.usersService.removeCoverPhoto(req.user.id);
            return {
                status: 'success',
                message: 'Foto de portada eliminada exitosamente',
                data: {
                    id: updatedUser.id,
                    foto_portada: updatedUser.foto_portada,
                    tipo_foto_portada: updatedUser.tipo_foto_portada,
                    updatedAt: new Date()
                }
            };
        }
        catch (error) {
            console.error('Error removing cover photo:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateUserSkills(req, body) {
        try {
            const updatedUser = await this.usersService.updateUserSkills(req.user.id, body.skillIds);
            return {
                status: 'success',
                message: 'Habilidades actualizadas exitosamente',
                data: {
                    id: updatedUser.id,
                    habilidades: updatedUser.habilidades
                }
            };
        }
        catch (error) {
            console.error('Error updating skills:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getMySkills(req) {
        try {
            const user = await this.usersService.findOne(req.user.id);
            return {
                status: 'success',
                data: user.habilidades || []
            };
        }
        catch (error) {
            console.error('Error fetching user skills:', error);
            throw new common_1.BadRequestException('Error obteniendo habilidades');
        }
    }
    async findAll(tipoUsuario, verificado, departamento) {
        try {
            const users = await this.usersService.findAll();
            let filteredUsers = users;
            if (tipoUsuario) {
                filteredUsers = filteredUsers.filter(u => u.tipo_usuario === tipoUsuario);
            }
            if (verificado !== undefined) {
                const isVerified = verificado === 'true';
                filteredUsers = filteredUsers.filter(u => u.verificado === isVerified);
            }
            if (departamento) {
                filteredUsers = filteredUsers.filter(u => u.departamento === departamento);
            }
            const usersWithoutPassword = filteredUsers.map(({ password, ...user }) => user);
            return {
                status: 'success',
                data: usersWithoutPassword
            };
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new common_1.BadRequestException('Error obteniendo usuarios');
        }
    }
    async getPendingWorkers() {
        try {
            const workers = await this.usersService.findPendingWorkers();
            const workersData = workers.map(({ password, ...worker }) => worker);
            return {
                status: 'success',
                data: workersData,
                count: workersData.length
            };
        }
        catch (error) {
            console.error('Error fetching pending workers:', error);
            throw new common_1.BadRequestException('Error obteniendo trabajadores pendientes');
        }
    }
    async getVerifiedWorkers(tipoUsuario, verificado, categoria, departamento, search) {
        try {
            const filters = {
                tipoUsuario: tipoUsuario || 'trabajador',
                verificado: verificado !== 'false',
                categoria,
                departamento,
                search,
            };
            console.log('🔍 Filters:', filters);
            const workers = await this.usersService.getVerifiedWorkers(filters);
            console.log(`✅ Found ${workers.length} workers`);
            const workersData = workers.map(worker => {
                const { password, email, dui, ...publicData } = worker;
                return publicData;
            });
            return {
                status: 'success',
                data: workersData,
                count: workersData.length
            };
        }
        catch (error) {
            console.error('❌ Error fetching workers:', error);
            throw new common_1.BadRequestException('Error obteniendo trabajadores');
        }
    }
    async verifyWorker(id, body) {
        try {
            const updatedUser = await this.usersService.verifyWorker(id, body.verified);
            const { password, ...result } = updatedUser;
            return {
                status: 'success',
                message: `Trabajador ${body.verified ? 'verificado' : 'no verificado'} exitosamente`,
                data: result
            };
        }
        catch (error) {
            console.error('Error verifying worker:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findOne(id) {
        try {
            const user = await this.usersService.findOne(id);
            const { password, ...result } = user;
            return {
                status: 'success',
                data: result
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
    }
    async update(id, updateData) {
        try {
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            const user = await this.usersService.update(id, updateData);
            const { password, ...result } = user;
            return {
                status: 'success',
                message: 'Usuario actualizado exitosamente',
                data: result
            };
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new common_1.BadRequestException('Error actualizando usuario');
        }
    }
    async remove(id) {
        try {
            await this.usersService.remove(id);
            return {
                status: 'success',
                message: 'Usuario eliminado exitosamente'
            };
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new common_1.BadRequestException('Error eliminando usuario');
        }
    }
    async suspend(id, body) {
        try {
            const user = await this.usersService.update(id, { activo: false });
            const { password, ...result } = user;
            return {
                status: 'success',
                message: 'Usuario suspendido exitosamente',
                data: result
            };
        }
        catch (error) {
            console.error('Error suspending user:', error);
            throw new common_1.BadRequestException('Error suspendiendo usuario');
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('public/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPublicProfile", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('change-type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeUserType", null);
__decorate([
    (0, common_1.Post)('profile-photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: imageFileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfilePhoto", null);
__decorate([
    (0, common_1.Post)('cover-photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: imageFileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCoverPhoto", null);
__decorate([
    (0, common_1.Delete)('cover-photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeCoverPhoto", null);
__decorate([
    (0, common_1.Put)('profile/skills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserSkills", null);
__decorate([
    (0, common_1.Get)('me/skills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMySkills", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Query)('tipo_usuario')),
    __param(1, (0, common_1.Query)('verificado')),
    __param(2, (0, common_1.Query)('departamento')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending-workers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPendingWorkers", null);
__decorate([
    (0, common_1.Get)('workers'),
    __param(0, (0, common_1.Query)('tipo_usuario')),
    __param(1, (0, common_1.Query)('verificado')),
    __param(2, (0, common_1.Query)('categoria')),
    __param(3, (0, common_1.Query)('departamento')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getVerifiedWorkers", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyWorker", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "suspend", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map