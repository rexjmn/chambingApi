"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.getCorsOrigins = getCorsOrigins;
exports.corsConfig = {
    development: {
        origins: [
            'http://localhost:5173',
            'http://localhost:3000'
        ]
    },
    production: {
        origins: [
            'https://tu-dominio.com'
        ]
    }
};
function getCorsOrigins() {
    const env = process.env.NODE_ENV || 'development';
    return exports.corsConfig[env].origins;
}
//# sourceMappingURL=cors.config.js.map