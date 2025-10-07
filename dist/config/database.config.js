"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.getCorsOrigins = getCorsOrigins;
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => {
    console.log('🔍 DATABASE CONFIG DEBUG:');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✓' : 'NOT SET ✗');
    console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    if (process.env.DATABASE_URL) {
        console.log('✅ Using DATABASE_URL');
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ['dist/**/*.entity{.ts,.js}'],
            migrationsTableName: 'migrations',
            migrationsRun: true,
            synchronize: false,
            logging: process.env.NODE_ENV === 'development',
            ssl: {
                rejectUnauthorized: false
            },
        };
    }
    console.log('⚠️ Using individual DB variables (fallback)');
    return {
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
    };
});
exports.corsConfig = {
    development: {
        origins: [
            'http://localhost:5173',
            'http://localhost:3000'
        ]
    },
    production: {
        origins: [
            'https://chambing.pro',
            'https://www.chambing.pro'
        ]
    }
};
function getCorsOrigins() {
    const env = process.env.NODE_ENV || 'development';
    return exports.corsConfig[env].origins;
}
//# sourceMappingURL=database.config.js.map