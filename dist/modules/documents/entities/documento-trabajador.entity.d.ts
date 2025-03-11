import { User } from '../../users/entities/user.entity';
export declare class DocumentoTrabajador {
    id: string;
    usuario: User;
    tipoDocumento: string;
    urlDocumento: string;
    fecha_carga: Date;
    fecha_vencimiento: Date;
    estadoVerificacion: string;
    verificador: User;
}
