import { User } from '../../users/entities/user.entity';
import { CategoriaServicio } from '../../services/entities/categoria-servicio.entity';
import { EstadoContrato } from './estado-contrato.entity';
export declare class Contrato {
    id: string;
    empleador: User;
    trabajador: User;
    categoria: CategoriaServicio;
    codigo_contrato: string;
    pin_activacion: string;
    codigo_qr_url: string;
    fecha_creacion: Date;
    fecha_inicio_programada: Date;
    fecha_fin_programada: Date;
    fecha_activacion: Date;
    fecha_completado: Date;
    fecha_cierre: Date;
    fecha_actualizacion: Date;
    estado: string;
    detalles_servicio: {
        descripcion: string;
        direccion: string;
        coordenadas?: {
            lat: number;
            lng: number;
        };
        duracion_estimada_horas?: number;
        notas_adicionales?: string;
    };
    terminos_condiciones: string;
    monto_total: number;
    estado_pago: string;
    metodo_pago: string;
    stripe_payment_intent_id: string;
    comision_plataforma: number;
    monto_trabajador: number;
    activado_por: string;
    metodo_activacion: string;
    ip_activacion: string | null;
    estados: EstadoContrato[];
    puedeSerActivado(): boolean;
    puedeSerCompletado(): boolean;
    puedeSerCancelado(): boolean;
    calcularMontoTrabajador(): number;
    estaVencido(): boolean;
}
