import { Pago } from './pago.entity';
export declare class TransaccionWompi {
    id: string;
    pagoId: string;
    wompiTransactionId: string;
    wompiReference: string;
    estadoWompi: string;
    monto: number;
    divisa: string;
    metodoPagoWompi: string;
    webhookData: any;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    pago: Pago;
    estaAprobada(): boolean;
    estaDeclinada(): boolean;
}
