import { ContractsService } from './contracts.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(createContratoDto: CreateContratoDto): Promise<import("./entities/contrato.entity").Contrato>;
    findAll(empleadorId?: string, trabajadorId?: string, estado?: string, fechaInicio?: Date, fechaFin?: Date): Promise<import("./entities/contrato.entity").Contrato[]>;
    findOne(id: string): Promise<import("./entities/contrato.entity").Contrato>;
    updateEstado(id: string, data: {
        nuevoEstado: string;
        usuarioId: string;
        notas?: string;
    }): Promise<import("./entities/contrato.entity").Contrato>;
    getHistorialEstados(id: string): Promise<import("./entities/estado-contrato.entity").EstadoContrato[]>;
}
