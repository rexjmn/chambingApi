import { MetodoPago } from '../entities/pago.entity';
export declare class CrearPagoDto {
    contratoId: string;
    trabajadorId: string;
    empleadorId: string;
    montoServicio: number;
    metodoPago: MetodoPago;
    porcentajeComision?: number;
}
export declare class ProcesarPagoEfectivoDto {
    confirmado: boolean;
    notas?: string;
}
