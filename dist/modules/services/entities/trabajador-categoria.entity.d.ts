import { CategoriaServicio } from './categoria-servicio.entity';
import { User } from '../../users/entities/user.entity';
export declare class TrabajadorCategoria {
    id: string;
    usuario: User;
    categoria: CategoriaServicio;
    verificado: boolean;
    fecha_verificacion: Date;
}
