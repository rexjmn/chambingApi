import { RolAdministrativo } from './rol-administrativo.entity';
export declare class Role {
    id: string;
    nombre: string;
    descripcion: string;
    nivelAcceso: number;
    permisos: object;
    rolesAdministrativos: RolAdministrativo[];
}
