import { User } from '../../users/entities/user.entity';
export declare class TarifaTrabajador {
    id: string;
    trabajador: User;
    tarifa_hora: number;
    tarifa_dia: number;
    tarifa_semana: number;
    tarifa_mes: number;
    moneda: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
}
