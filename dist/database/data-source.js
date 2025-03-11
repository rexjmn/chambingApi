"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path = require("path");
(0, dotenv_1.config)();
const dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'app_servicios',
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: true
};
exports.AppDataSource = new typeorm_1.DataSource(dataSourceOptions);
//# sourceMappingURL=data-source.js.map