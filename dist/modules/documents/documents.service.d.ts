import { Repository } from 'typeorm';
import { DocumentoTrabajador } from './entities/documento-trabajador.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
export declare class DocumentsService {
    private documentosRepository;
    constructor(documentosRepository: Repository<DocumentoTrabajador>);
    create(createDocumentoDto: CreateDocumentoDto): Promise<DocumentoTrabajador>;
    findAll(filters?: {
        usuarioId?: string;
        tipoDocumento?: string;
        estadoVerificacion?: string;
    }): Promise<DocumentoTrabajador[]>;
    findOne(id: string): Promise<DocumentoTrabajador>;
    verifyDocument(id: string, verificadorId: string, resultado: 'aprobado' | 'rechazado', notas?: string): Promise<DocumentoTrabajador>;
    update(id: string, updateDocumentoDto: UpdateDocumentoDto): Promise<DocumentoTrabajador>;
}
