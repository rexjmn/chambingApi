"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../modules/users/users.module");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const login_attempt_entity_1 = require("./entities/login-attempt.entity");
const token_service_1 = require("./services/token.service");
const login_attempt_service_1 = require("./services/login-attempt.service");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([refresh_token_entity_1.RefreshToken, login_attempt_entity_1.LoginAttempt]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
        ],
        providers: [
            auth_service_1.AuthService,
            token_service_1.TokenService,
            login_attempt_service_1.LoginAttemptService,
            jwt_strategy_1.JwtStrategy
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, token_service_1.TokenService, login_attempt_service_1.LoginAttemptService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map