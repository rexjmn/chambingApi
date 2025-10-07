import { User } from '../../users/entities/user.entity';
export declare enum TipoNotificacion {
    COMISION_PENDIENTE = "comision_pendiente",
    PAGO_RECIBIDO = "pago_recibido",
    CUENTA_BLOQUEADA = "cuenta_bloqueada",
    PAGO_FALLIDO = "pago_fallido",
    RECORDATORIO_DEUDA = "recordatorio_deuda"
}
export declare class NotificacionPago {
    id: string;
    usuarioId: string;
    tipo: TipoNotificacion;
    titulo: string;
    mensaje: string;
    leida: boolean;
    enviadaEmail: boolean;
    datosAdicionales: any;
    fechaCreacion: Date;
    usuario: User;
    marcarComoLeida(): void;
    marcarEmailEnviado(): void;
}
