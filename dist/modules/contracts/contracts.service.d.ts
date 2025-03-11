import { Repository } from 'typeorm';
import { Contrato } from './entities/contrato.entity';
import { EstadoContrato } from './entities/estado-contrato.entity';
import { CreateContratoDto } from './dto/create-contrato.dto';
export declare class ContractsService {
    private contratosRepository;
    private estadosRepository;
    constructor(contratosRepository: Repository<Contrato>, estadosRepository: Repository<EstadoContrato>);
    private generateContractCode;
    private generateQRCode;
    create(createContratoDto: CreateContratoDto): Promise<Contrato>;
    findAll(filters?: {
        empleadorId?: string;
        trabajadorId?: string;
        estado?: string;
        fechaInicio?: Date;
        fechaFin?: Date;
    }): Promise<Contrato[]>;
    findOne(id: string): Promise<Contrato>;
    updateEstado(id: string, nuevoEstado: string, usuarioId: string, notas?: string): Promise<Contrato>;
    private validarTransicionEstado;
    private registrarEstadoContrato;
    getHistorialEstados(contratoId: string): Promise<EstadoContrato[]>;
}
