export declare class CreateUserDto {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    departamento?: string;
    municipio?: string;
    direccion?: string;
    biografia?: string;
    dui?: string;
    foto_perfil?: string;
    tipo_usuario?: 'cliente' | 'trabajador';
    verificado?: boolean;
}
