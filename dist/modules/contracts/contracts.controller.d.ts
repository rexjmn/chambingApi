import { ContractsService } from './contracts.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { ActivarContratoDto } from './dto/activar-contrato.dto';
import { CompletarContratoDto } from './dto/completar-contrato.dto';
import { CancelarContratoDto } from './dto/cancelar-contrato.dto';
import { CerrarContratoDto } from './dto/cerrar-contrato.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        roles: string[];
    };
}
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(createContratoDto: CreateContratoDto, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            codigo_contrato: string;
            pin_activacion: string;
            codigo_qr_url: string;
            estado: string;
            monto_total: number;
            monto_trabajador: number;
            fecha_inicio_programada: Date;
            empleador: {
                id: string;
                nombre: string;
                apellido: string;
            };
            trabajador: {
                id: string;
                nombre: string;
                apellido: string;
            };
        };
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    activarContrato(activarDto: ActivarContratoDto, req: RequestWithUser, ip: string): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            codigo_contrato: string;
            estado: string;
            fecha_activacion: Date;
            activado_por: string;
            metodo_activacion: string;
            estado_pago: string;
        };
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    completarContrato(id: string, completarDto: CompletarContratoDto, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            estado: string;
            fecha_completado: Date;
        };
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    cerrarContrato(id: string, cerrarDto: CerrarContratoDto, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            estado: string;
            estado_pago: string;
            fecha_cierre: Date;
            monto_trabajador: number;
        };
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    cancelarContrato(id: string, cancelarDto: CancelarContratoDto, req: RequestWithUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            estado: string;
            estado_pago: string;
        };
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    findAll(empleadorId?: string, trabajadorId?: string, estado?: string, req?: RequestWithUser): Promise<{
        status: string;
        data: import("./entities/contrato.entity").Contrato[];
        count: number;
        message?: undefined;
    } | {
        status: string;
        message: any;
        data: never[];
        count?: undefined;
    }>;
    getMisContratos(req: RequestWithUser, rol?: 'empleador' | 'trabajador', estado?: string): Promise<{
        status: string;
        data: import("./entities/contrato.entity").Contrato[];
        count: number;
        message?: undefined;
    } | {
        status: string;
        message: any;
        data: never[];
        count?: undefined;
    }>;
    findOne(id: string): Promise<{
        status: string;
        data: import("./entities/contrato.entity").Contrato;
        message?: undefined;
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    findByCodigoContrato(codigo: string): Promise<{
        status: string;
        data: import("./entities/contrato.entity").Contrato;
        message?: undefined;
    } | {
        status: string;
        message: any;
        data: null;
    }>;
    getHistorialEstados(id: string): Promise<{
        status: string;
        data: import("./entities/estado-contrato.entity").EstadoContrato[];
        message?: undefined;
    } | {
        status: string;
        message: any;
        data: never[];
    }>;
    getAllContracts(estado?: string, page?: number, limit?: number): Promise<{
        status: string;
        data: import("./entities/contrato.entity").Contrato[];
        count: number;
        page: number;
        limit: number;
        message?: undefined;
    } | {
        status: string;
        message: any;
        data: never[];
        count?: undefined;
        page?: undefined;
        limit?: undefined;
    }>;
}
export {};
