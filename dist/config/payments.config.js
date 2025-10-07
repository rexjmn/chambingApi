"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsConfig = void 0;
exports.paymentsConfig = {
    wompi: {
        apiUrl: process.env.WOMPI_API_URL || 'https://sandbox-api.wompi.sv',
        clientId: process.env.WOMPI_CLIENT_ID,
        clientSecret: process.env.WOMPI_CLIENT_SECRET,
        webhookSecret: process.env.WOMPI_WEBHOOK_SECRET,
    },
    comisiones: {
        porcentajeDefault: 10,
        limiteDeudaBloqueo: 50,
        recordatorioDeudaDias: [3, 7, 14],
    },
    notificaciones: {
        emailEnabled: process.env.EMAIL_NOTIFICATIONS === 'true',
        smsEnabled: process.env.SMS_NOTIFICATIONS === 'true',
    },
};
//# sourceMappingURL=payments.config.js.map