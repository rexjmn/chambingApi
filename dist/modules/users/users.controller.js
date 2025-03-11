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
const bcrypt = require("bcrypt");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async updateProfilePhoto(file, req) {
        console.log('Token:', req.headers.authorization);
        console.log('User:', req.user);
        try {
            const updatedUser = await this.usersService.updateProfilePhoto(req.user.id, file);
            return {
                status: 'success',
                message: 'Foto de perfil actualizada exitosamente',
                data: {
                    id: updatedUser.id,
                    foto_perfil: updatedUser.foto_perfil,
                    updatedAt: new Date()
                }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
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
    async getProfile(req) {
        const user = await this.usersService.findOne(req.user.id);
        const { password, ...result } = user;
        return {
            status: 'success',
            data: result
        };
    }
    async getMe(req) {
        const user = await this.usersService.findOne(req.user.id);
        const { password, ...result } = user;
        return {
            status: 'success',
            data: {
                ...result,
                roles: await this.usersService.getUserRoles(req.user.id)
            }
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('profile-photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
                cb(new common_1.BadRequestException('Solo se permiten imágenes'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfilePhoto", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
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
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map