import { User } from '../../users/entities/user.entity';
import { CategoriaServicio } from '../../services/entities/categoria-servicio.entity';
import { EstadoContrato } from './estado-contrato.entity';
export declare class Contrato {
    id: string;
    empleador: User;
    trabajador: User;
    categoria: CategoriaServicio;
    codigo_contrato: string;
    fecha_creacion: Date;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: string;
    detalles_servicio: object;
    terminos_condiciones: string;
    monto: number;
    codigo_qr_url: string;
    estados: EstadoContrato[];
}
