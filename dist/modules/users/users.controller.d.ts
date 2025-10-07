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
    register(createUserDto: CreateUserDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    getPublicProfile(id: string): Promise<{
        status: string;
        data: {
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador | null;
            id: string;
            email: string;
            password: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    getProfile(req: RequestWithUser): Promise<{
        status: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    getMe(req: RequestWithUser): Promise<{
        status: string;
        data: {
            roles: string[];
            tipo_usuario: string;
            verificado: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            habilidades: import("../skills/entities/skill.entity").Skill[];
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
        };
    }>;
    updateProfile(req: RequestWithUser, updateData: any): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    changeUserType(req: RequestWithUser, body: {
        tipo_usuario: 'cliente' | 'trabajador';
    }): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    updateProfilePhoto(file: Express.Multer.File, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            updatedAt: Date;
        };
    }>;
    updateCoverPhoto(file: Express.Multer.File, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            updatedAt: Date;
        };
    }>;
    removeCoverPhoto(req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            updatedAt: Date;
        };
    }>;
    updateUserSkills(req: RequestWithUser, body: {
        skillIds: string[];
    }): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    getMySkills(req: RequestWithUser): Promise<{
        status: string;
        data: import("../skills/entities/skill.entity").Skill[];
    }>;
    findAll(tipoUsuario?: string, verificado?: string, departamento?: string): Promise<{
        status: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        }[];
    }>;
    getPendingWorkers(): Promise<{
        status: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        }[];
        count: number;
    }>;
    getVerifiedWorkers(tipoUsuario?: string, verificado?: string, categoria?: string, departamento?: string, search?: string): Promise<{
        status: string;
        data: any[];
        count: number;
    }>;
    verifyWorker(id: string, body: {
        verified: boolean;
    }): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    findOne(id: string): Promise<{
        status: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    update(id: string, updateData: any): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
    }>;
    suspend(id: string, body: {
        reason: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            email: string;
            nombre: string;
            apellido: string;
            telefono: string;
            departamento: string;
            municipio: string;
            direccion: string;
            titulo_profesional: string;
            biografia: string;
            dui: string;
            activo: boolean;
            foto_perfil: string | null;
            tipo_foto_perfil: string | null;
            foto_portada: string | null;
            tipo_foto_portada: string | null;
            tipo_usuario: string;
            verificado: boolean;
            fecha_registro: Date;
            rolesAdministrativos: import("../roles/entities/rol-administrativo.entity").RolAdministrativo[];
            tarifas: import("../services/entities/tarifa-trabajador.entity").TarifaTrabajador[];
            habilidades: import("../skills/entities/skill.entity").Skill[];
        };
    }>;
}
export {};
