"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'app_servicios',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production',
}));
//# sourceMappingURL=database.config.js.map