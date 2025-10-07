"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const services_module_1 = require("./modules/services/services.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const documents_module_1 = require("./modules/documents/documents.module");
const app_controller_1 = require("./app.controller");
const aws_module_1 = require("./modules/aws/aws.module");
const payments_module_1 = require("./modules/payments/payments.module");
const admin_module_1 = require("./modules/admin/admin.module");
const skills_module_1 = require("./modules/skills/skills.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const dbConfig = configService.get('database');
                    return {
                        ...dbConfig,
                        autoLoadEntities: true,
                    };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            services_module_1.ServicesModule,
            contracts_module_1.ContractsModule,
            documents_module_1.DocumentsModule,
            skills_module_1.SkillsModule,
            aws_module_1.AwsModule,
            admin_module_1.AdminModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map