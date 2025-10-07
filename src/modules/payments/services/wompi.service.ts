import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WompiPaymentResponse {
  success: boolean;
  transaction_id?: string;
  reference?: string;
  status?: string;
  payment_url?: string;
  error?: string;
}

export interface WompiWebhookPayload {
  transaction_id: string;
  reference: string;
  status: string;
  amount: number;
  currency: string;
  payment_method: string;
  timestamp: string;
}

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly apiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('WOMPI_API_URL') || 'https://sandbox-api.wompi.sv';
   this.clientId = this.configService.get('WOMPI_CLIENT_ID') || '';
this.clientSecret = this.configService.get('WOMPI_CLIENT_SECRET') || '';
  }

  async crearEnlacePago(
    monto: number,
    descripcion: string,
    referencia: string,
    webhookUrl?: string,
  ): Promise<WompiPaymentResponse> {
    this.logger.log(`🎯 Creando enlace de pago: $${monto} - ${descripcion}`);

    // Mock response para desarrollo
    const mockResponse: WompiPaymentResponse = {
      success: true,
      transaction_id: `mock_txn_${Date.now()}`,
      reference: referencia,
      status: 'PENDING',
      payment_url: `https://mock-wompi.sv/pay/${referencia}`,
    };
    
    this.logger.debug('✅ Mock Wompi Response:', mockResponse);
    return mockResponse;
  }

  async verificarTransaccion(transactionId: string): Promise<WompiPaymentResponse> {
    this.logger.log(`🔍 Verificando transacción: ${transactionId}`);
    return {
      success: true,
      transaction_id: transactionId,
      status: Math.random() > 0.2 ? 'APPROVED' : 'DECLINED',
    };
  }

  async procesarWebhook(payload: WompiWebhookPayload): Promise<boolean> {
    this.logger.log(`📨 Procesando webhook: ${payload.transaction_id}`);
    return true; // Aceptar todos los webhooks en modo mock
  }
}