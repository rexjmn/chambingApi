import { User } from '../../users/entities/user.entity';
export declare class SaldoTrabajador {
    id: string;
    trabajadorId: string;
    saldoComisionesPendientes: number;
    saldoDisponible: number;
    totalGanado: number;
    fechaUltimoPago: Date;
    estadoCuenta: string;
    bloqueadoPorDeuda: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    trabajador: User;
    puedeTrabajar(): boolean;
    actualizarDeuda(monto: number): void;
}
