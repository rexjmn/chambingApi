import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { SaldoTrabajador } from './entities/saldo-trabajador.entity';
import { TransaccionWompi } from './entities/transaccion-wompi.entity';
import { NotificacionPago } from './entities/notificacion-pago.entity';
import { WompiService, WompiWebhookPayload } from './services/wompi.service';
import { CrearPagoDto } from './dto/crear-pago.dto';
export declare class PaymentsService {
    private pagoRepository;
    private saldoRepository;
    private transaccionRepository;
    private notificacionRepository;
    private wompiService;
    private readonly logger;
    constructor(pagoRepository: Repository<Pago>, saldoRepository: Repository<SaldoTrabajador>, transaccionRepository: Repository<TransaccionWompi>, notificacionRepository: Repository<NotificacionPago>, wompiService: WompiService);
    crearPago(dto: CrearPagoDto): Promise<Pago>;
    private crearTransaccionWompi;
    procesarPagoEfectivo(pagoId: string, confirmado: boolean, notas?: string): Promise<Pago>;
    manejarWebhookWompi(payload: WompiWebhookPayload): Promise<void>;
    private actualizarSaldoTrabajador;
    private crearNotificacion;
    obtenerSaldoTrabajador(trabajadorId: string): Promise<SaldoTrabajador>;
    obtenerHistorialPagos(trabajadorId: string, limite?: number, offset?: number): Promise<{
        pagos: Pago[];
        total: number;
    }>;
    obtenerNotificaciones(usuarioId: string, limite?: number, offset?: number): Promise<{
        notificaciones: NotificacionPago[];
        total: number;
    }>;
    marcarNotificacionLeida(notificacionId: string, usuarioId: string): Promise<boolean>;
}
