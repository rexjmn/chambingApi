import { PaymentsService } from './payments.service';
import { WompiWebhookPayload } from './services/wompi.service';
import { CrearPagoDto, ProcesarPagoEfectivoDto } from './dto/crear-pago.dto';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        [key: string]: any;
    };
}
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    crearPago(dto: CrearPagoDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/pago.entity").Pago;
    }>;
    procesarPagoEfectivo(pagoId: string, dto: ProcesarPagoEfectivoDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/pago.entity").Pago;
    }>;
    webhookWompi(payload: WompiWebhookPayload): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    obtenerSaldo(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            saldoDisponible: number;
            comisionesPendientes: number;
            totalGanado: number;
            puedeTrabajar: boolean;
            bloqueadoPorDeuda: boolean;
            fechaUltimoPago: Date;
        };
    }>;
    obtenerHistorial(req: AuthenticatedRequest, limite?: string, offset?: string): Promise<{
        success: boolean;
        data: {
            pagos: import("./entities/pago.entity").Pago[];
            total: number;
            limite: number;
            offset: number;
        };
    }>;
}
export {};
