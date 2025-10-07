import { TransaccionWompi } from './transaccion-wompi.entity';
export declare enum MetodoPago {
    EFECTIVO = "efectivo",
    WOMPI_TARJETA = "wompi_tarjeta",
    WOMPI_BITCOIN = "wompi_bitcoin"
}
export declare enum EstadoPago {
    PENDIENTE = "pendiente",
    COMPLETADO = "completado",
    FALLIDO = "fallido",
    REEMBOLSADO = "reembolsado"
}
export declare class Pago {
    id: string;
    contratoId: string;
    trabajadorId: string;
    empleadorId: string;
    montoServicio: number;
    comisionPlataforma: number;
    montoTrabajador: number;
    metodoPago: MetodoPago;
    estadoPago: EstadoPago;
    referenciaExterna: string;
    comisionPagada: boolean;
    fechaPagoServicio: Date;
    fechaPagoComision: Date;
    notas: string;
    transaccionesWompi: TransaccionWompi[];
    calcularComision(porcentaje?: number): void;
    esMetodoElectronico(): boolean;
}
