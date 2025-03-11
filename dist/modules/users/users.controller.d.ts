import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        roles: string[];
    };
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfilePhoto(file: Express.Multer.File, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            foto_perfil: string;
            updatedAt: Date;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            tipo_usuario: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            dui: string;
            activo: boolean;
            foto_perfil: string;
            tipo_foto_perfil: string;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
        };
    }>;
    getProfile(req: RequestWithUser): Promise<{
        status: string;
        data: {
            id: string;
            tipo_usuario: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            dui: string;
            activo: boolean;
            foto_perfil: string;
            tipo_foto_perfil: string;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
        };
    }>;
    getMe(req: RequestWithUser): Promise<{
        status: string;
        data: {
            roles: string[];
            id: string;
            tipo_usuario: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            dui: string;
            activo: boolean;
            foto_perfil: string;
            tipo_foto_perfil: string;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
        };
    }>;
}
export {};
