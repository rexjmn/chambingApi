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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../modules/users/users.service");
const token_service_1 = require("./services/token.service");
const login_attempt_service_1 = require("./services/login-attempt.service");
const bcrypt = require("bcrypt");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, tokenService, loginAttemptService) {
        this.usersService = usersService;
        this.tokenService = tokenService;
        this.loginAttemptService = loginAttemptService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    getClientInfo(request) {
        const ip = request.ip ||
            request.connection?.remoteAddress ||
            'unknown';
        const userAgent = request.headers['user-agent'] || 'unknown';
        return {
            ip,
            userAgent
        };
    }
    async login(loginDto, request) {
        const clientInfo = this.getClientInfo(request);
        const blockStatus = await this.loginAttemptService.isBlocked(loginDto.email, clientInfo.ip);
        if (blockStatus.blocked) {
            throw new common_1.UnauthorizedException(`Esta cuenta está temporalmente bloqueada por múltiples intentos fallidos. ` +
                `Por favor, intente nuevamente en ${blockStatus.remainingTime} minutos.`);
        }
        try {
            const user = await this.usersService.findByEmail(loginDto.email);
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                await this.loginAttemptService.recordAttempt(loginDto.email, clientInfo.ip, clientInfo.userAgent, false);
                const attemptInfo = await this.loginAttemptService.getLoginAttemptInfo(loginDto.email, clientInfo.ip);
                if (attemptInfo.remainingAttempts > 0) {
                    throw new common_1.UnauthorizedException(`Credenciales inválidas. Le quedan ${attemptInfo.remainingAttempts} ` +
                        `intento${attemptInfo.remainingAttempts === 1 ? '' : 's'} antes de que ` +
                        `la cuenta sea bloqueada temporalmente.`);
                }
                else {
                    throw new common_1.UnauthorizedException('Credenciales inválidas. La cuenta ha sido bloqueada temporalmente ' +
                        'por seguridad debido a múltiples intentos fallidos.');
                }
            }
            await this.loginAttemptService.recordAttempt(loginDto.email, clientInfo.ip, clientInfo.userAgent, true);
            const tokens = await this.tokenService.generateAuthTokens(user, request);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    roles: await this.usersService.getUserRoles(user.id)
                },
                ...tokens
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                await this.loginAttemptService.recordAttempt(loginDto.email, clientInfo.ip, clientInfo.userAgent, false);
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            this.logger.error(`Error en el proceso de login: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Error durante el proceso de autenticación');
        }
    }
    async logout(refreshToken) {
        await this.tokenService.revokeRefreshToken(refreshToken);
    }
    async refreshToken(refreshToken, request) {
        return this.tokenService.refreshAccessToken(refreshToken, request);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        token_service_1.TokenService,
        login_attempt_service_1.LoginAttemptService])
], AuthService);
//# sourceMappingURL=auth.service.js.map