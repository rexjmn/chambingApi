import { RolAdministrativo } from '../../roles/entities/rol-administrativo.entity';
export declare class User {
    id: string;
    tipo_usuario: string;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono: string;
    dui: string;
    activo: boolean;
    foto_perfil: string;
    tipo_foto_perfil: string;
    rolesAdministrativos: RolAdministrativo[];
}
