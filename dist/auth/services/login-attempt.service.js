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
var LoginAttemptService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAttemptService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const login_attempt_entity_1 = require("../entities/login-attempt.entity");
let LoginAttemptService = LoginAttemptService_1 = class LoginAttemptService {
    constructor(loginAttemptRepo) {
        this.loginAttemptRepo = loginAttemptRepo;
        this.logger = new common_1.Logger(LoginAttemptService_1.name);
        this.MAX_ATTEMPTS = 5;
        this.ATTEMPT_WINDOW = 30 * 60 * 1000;
        this.BLOCK_DURATION = 15 * 60 * 1000;
    }
    async recordAttempt(email, ip, userAgent, successful) {
        try {
            const loginAttempt = new login_attempt_entity_1.LoginAttempt();
            loginAttempt.email = email;
            loginAttempt.ipAddress = ip;
            loginAttempt.userAgent = userAgent;
            loginAttempt.successful = successful;
            loginAttempt.details = {
                timestamp: new Date().toISOString(),
                successful,
                attemptType: 'login'
            };
            await this.loginAttemptRepo.save(loginAttempt);
            if (successful) {
                await this.clearFailedAttempts(email, ip);
            }
            else {
                await this.handleFailedAttempt(email, ip);
            }
        }
        catch (error) {
            this.logger.error(`Error registrando intento de inicio de sesión: ${error.message}`, error.stack);
            throw error;
        }
    }
    async clearFailedAttempts(email, ip) {
        try {
            const failedAttempts = await this.loginAttemptRepo.find({
                where: {
                    email,
                    ipAddress: ip,
                    successful: false,
                    timestamp: (0, typeorm_2.MoreThan)(new Date(Date.now() - this.ATTEMPT_WINDOW))
                }
            });
            for (const attempt of failedAttempts) {
                attempt.details = {
                    ...attempt.details,
                    resolved: true,
                    resolvedAt: new Date().toISOString(),
                    resolution: 'successful_login'
                };
                await this.loginAttemptRepo.save(attempt);
            }
        }
        catch (error) {
            this.logger.error(`Error limpiando intentos fallidos: ${error.message}`, error.stack);
        }
    }
    async handleFailedAttempt(email, ip) {
        try {
            const recentAttempts = await this.getRecentFailedAttempts(email, ip);
            if (recentAttempts.length >= this.MAX_ATTEMPTS) {
                const blockRecord = new login_attempt_entity_1.LoginAttempt();
                blockRecord.email = email;
                blockRecord.ipAddress = ip;
                blockRecord.successful = false;
                blockRecord.details = {
                    type: 'block',
                    reason: 'too_many_attempts',
                    attemptCount: recentAttempts.length,
                    blockTimestamp: new Date().toISOString(),
                    blockDuration: this.BLOCK_DURATION,
                    blockExpiresAt: new Date(Date.now() + this.BLOCK_DURATION).toISOString()
                };
                await this.loginAttemptRepo.save(blockRecord);
                this.logger.warn(`Cuenta bloqueada: ${email} desde IP ${ip}. ` +
                    `Expira en: ${this.BLOCK_DURATION / 60000} minutos`);
            }
        }
        catch (error) {
            this.logger.error(`Error manejando intento fallido: ${error.message}`, error.stack);
            throw error;
        }
    }
    async isBlocked(email, ip) {
        try {
            const recentBlock = await this.loginAttemptRepo.findOne({
                where: {
                    email,
                    ipAddress: ip,
                    timestamp: (0, typeorm_2.MoreThan)(new Date(Date.now() - this.BLOCK_DURATION)),
                    successful: false
                },
                order: { timestamp: 'DESC' }
            });
            if (recentBlock?.details?.type === 'block') {
                const blockExpiresAt = new Date(recentBlock.details.blockExpiresAt);
                const now = new Date();
                if (blockExpiresAt > now) {
                    const remainingTime = Math.ceil((blockExpiresAt.getTime() - now.getTime()) / 60000);
                    return { blocked: true, remainingTime };
                }
            }
            return { blocked: false };
        }
        catch (error) {
            this.logger.error(`Error verificando estado de bloqueo: ${error.message}`, error.stack);
            return { blocked: true };
        }
    }
    async getRecentFailedAttempts(email, ip) {
        return this.loginAttemptRepo.find({
            where: {
                email,
                ipAddress: ip,
                successful: false,
                timestamp: (0, typeorm_2.MoreThan)(new Date(Date.now() - this.ATTEMPT_WINDOW))
            },
            order: { timestamp: 'DESC' }
        });
    }
    async getLoginAttemptInfo(email, ip) {
        try {
            const recentFailedAttempts = await this.getRecentFailedAttempts(email, ip);
            const blockStatus = await this.isBlocked(email, ip);
            const remainingAttempts = Math.max(0, this.MAX_ATTEMPTS - recentFailedAttempts.length);
            return {
                recentAttempts: recentFailedAttempts.length,
                remainingAttempts,
                isBlocked: blockStatus.blocked,
                blockExpiresIn: blockStatus.remainingTime
            };
        }
        catch (error) {
            this.logger.error(`Error obteniendo información de intentos de inicio de sesión: ${error.message}`, error.stack);
            return {
                recentAttempts: this.MAX_ATTEMPTS,
                remainingAttempts: 0,
                isBlocked: true
            };
        }
    }
};
exports.LoginAttemptService = LoginAttemptService;
exports.LoginAttemptService = LoginAttemptService = LoginAttemptService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LoginAttemptService);
//# sourceMappingURL=login-attempt.service.js.map