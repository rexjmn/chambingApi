export const paymentsConfig = {
  wompi: {
    apiUrl: process.env.WOMPI_API_URL || 'https://sandbox-api.wompi.sv',
    clientId: process.env.WOMPI_CLIENT_ID,
    clientSecret: process.env.WOMPI_CLIENT_SECRET,
    webhookSecret: process.env.WOMPI_WEBHOOK_SECRET,
  },
  comisiones: {
    porcentajeDefault: 10,
    limiteDeudaBloqueo: 50, // $50 USD
    recordatorioDeudaDias: [3, 7, 14], // Días para enviar recordatorios
  },
  notificaciones: {
    emailEnabled: process.env.EMAIL_NOTIFICATIONS === 'true',
    smsEnabled: process.env.SMS_NOTIFICATIONS === 'true',
  },
};