import { Contrato } from './contrato.entity';
import { User } from '../../users/entities/user.entity';
export declare class EstadoContrato {
    id: string;
    contrato: Contrato;
    estado_anterior: string | null;
    estado_nuevo: string;
    fecha_cambio: Date;
    usuario: User;
    notas: string | null;
}
