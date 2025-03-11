import { DocumentsService } from './documents.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadDocument(file: Express.Multer.File, createDocumentoDto: CreateDocumentoDto): Promise<import("./entities/documento-trabajador.entity").DocumentoTrabajador>;
    findAll(usuarioId?: string, tipoDocumento?: string, estadoVerificacion?: string): Promise<import("./entities/documento-trabajador.entity").DocumentoTrabajador[]>;
    findOne(id: string): Promise<import("./entities/documento-trabajador.entity").DocumentoTrabajador>;
    verifyDocument(id: string, verificationData: {
        verificadorId: string;
        resultado: 'aprobado' | 'rechazado';
        notas?: string;
    }): Promise<import("./entities/documento-trabajador.entity").DocumentoTrabajador>;
    update(id: string, updateDocumentoDto: UpdateDocumentoDto): Promise<import("./entities/documento-trabajador.entity").DocumentoTrabajador>;
    private uploadToStorage;
}
