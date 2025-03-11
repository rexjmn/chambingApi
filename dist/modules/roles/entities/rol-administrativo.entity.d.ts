import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';
export declare class RolAdministrativo {
    id: string;
    usuario: User;
    rol: Role;
    asignadoPor: User;
    fecha_asignacion: Date;
    activo: boolean;
}
