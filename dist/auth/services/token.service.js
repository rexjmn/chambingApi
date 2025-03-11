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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
const users_service_1 = require("../../modules/users/users.service");
let TokenService = class TokenService {
    constructor(refreshTokenRepo, jwtService, configService, userService) {
        this.refreshTokenRepo = refreshTokenRepo;
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
    }
    async generateAuthTokens(user, request) {
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user, request);
        return {
            accessToken,
            refreshToken: refreshToken.token,
            expiresIn: 900
        };
    }
    async generateAccessToken(user) {
        const roles = await this.userService.getUserRoles(user.id);
        const payload = {
            sub: user.id,
            email: user.email,
            roles
        };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '15m'
        });
    }
    async generateRefreshToken(user, request) {
        await this.revokeUserRefreshTokens(user.id);
        const token = this.jwtService.sign({ sub: user.id }, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d'
        });
        const refreshToken = this.refreshTokenRepo.create({
            user,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ipAddress: request.socket.remoteAddress,
            userAgent: request.headers['user-agent']
        });
        return await this.refreshTokenRepo.save(refreshToken);
    }
    async refreshAccessToken(refreshToken, request) {
        const token = await this.findAndValidateRefreshToken(refreshToken);
        if (!token || !token.isActive()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return this.generateAuthTokens(token.user, request);
    }
    async findAndValidateRefreshToken(token) {
        const refreshToken = await this.refreshTokenRepo.findOne({
            where: { token, revoked: false },
            relations: ['user']
        });
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return refreshToken;
    }
    async revokeUserRefreshTokens(userId) {
        await this.refreshTokenRepo.update({ user: { id: userId }, revoked: false }, { revoked: true });
    }
    async revokeRefreshToken(token) {
        const result = await this.refreshTokenRepo.update({ token }, { revoked: true });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Token not found');
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], TokenService);
//# sourceMappingURL=token.service.js.map