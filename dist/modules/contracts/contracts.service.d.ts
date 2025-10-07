import { Repository } from 'typeorm';
import { Contrato } from './entities/contrato.entity';
import { EstadoContrato } from './entities/estado-contrato.entity';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { ActivarContratoDto } from './dto/activar-contrato.dto';
export declare class ContractsService {
    private contratosRepository;
    private estadosRepository;
    constructor(contratosRepository: Repository<Contrato>, estadosRepository: Repository<EstadoContrato>);
    private generateContractCode;
    private generatePIN;
    private generateQRCode;
    private calcularMontoTrabajador;
    create(createContratoDto: CreateContratoDto): Promise<Contrato>;
    activarContrato(activarDto: ActivarContratoDto, usuarioId: string, ip?: string): Promise<Contrato>;
    completarContrato(contratoId: string, usuarioId: string, notas?: string): Promise<Contrato>;
    cerrarContrato(contratoId: string, usuarioId: string, notas?: string): Promise<Contrato>;
    cancelarContrato(contratoId: string, usuarioId: string, motivo: string): Promise<Contrato>;
    findAll(filters?: {
        empleadorId?: string;
        trabajadorId?: string;
        estado?: string;
        fechaInicio?: Date;
        fechaFin?: Date;
    }): Promise<Contrato[]>;
    findOne(id: string): Promise<Contrato>;
    findByCodigoContrato(codigo: string): Promise<Contrato>;
    getHistorialEstados(contratoId: string): Promise<EstadoContrato[]>;
    private registrarEstadoContrato;
    getContratosCerradosPorTrabajador(trabajadorId: string): Promise<Contrato[]>;
}
