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
var WompiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WompiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WompiService = WompiService_1 = class WompiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WompiService_1.name);
        this.apiUrl = this.configService.get('WOMPI_API_URL') || 'https://sandbox-api.wompi.sv';
        this.clientId = this.configService.get('WOMPI_CLIENT_ID') || '';
        this.clientSecret = this.configService.get('WOMPI_CLIENT_SECRET') || '';
    }
    async crearEnlacePago(monto, descripcion, referencia, webhookUrl) {
        this.logger.log(`🎯 Creando enlace de pago: $${monto} - ${descripcion}`);
        const mockResponse = {
            success: true,
            transaction_id: `mock_txn_${Date.now()}`,
            reference: referencia,
            status: 'PENDING',
            payment_url: `https://mock-wompi.sv/pay/${referencia}`,
        };
        this.logger.debug('✅ Mock Wompi Response:', mockResponse);
        return mockResponse;
    }
    async verificarTransaccion(transactionId) {
        this.logger.log(`🔍 Verificando transacción: ${transactionId}`);
        return {
            success: true,
            transaction_id: transactionId,
            status: Math.random() > 0.2 ? 'APPROVED' : 'DECLINED',
        };
    }
    async procesarWebhook(payload) {
        this.logger.log(`📨 Procesando webhook: ${payload.transaction_id}`);
        return true;
    }
};
exports.WompiService = WompiService;
exports.WompiService = WompiService = WompiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WompiService);
//# sourceMappingURL=wompi.service.js.map