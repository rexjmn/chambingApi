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
export declare class WompiService {
    private configService;
    private readonly logger;
    private readonly apiUrl;
    private readonly clientId;
    private readonly clientSecret;
    constructor(configService: ConfigService);
    crearEnlacePago(monto: number, descripcion: string, referencia: string, webhookUrl?: string): Promise<WompiPaymentResponse>;
    verificarTransaccion(transactionId: string): Promise<WompiPaymentResponse>;
    procesarWebhook(payload: WompiWebhookPayload): Promise<boolean>;
}
