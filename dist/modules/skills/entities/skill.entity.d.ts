import { User } from '../../users/entities/user.entity';
export declare class Skill {
    id: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    activo: boolean;
    created_at: Date;
    usuarios: User[];
}
