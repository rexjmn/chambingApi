import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('saldos_trabajador')
export class SaldoTrabajador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trabajador_id' })
  trabajadorId: string;

  @Column('decimal', { 
    name: 'saldo_comisiones_pendientes',
    precision: 10, 
    scale: 2, 
    default: 0 
  })
  saldoComisionesPendientes: number;

  @Column('decimal', { 
    name: 'saldo_disponible',
    precision: 10, 
    scale: 2, 
    default: 0 
  })
  saldoDisponible: number;

  @Column('decimal', { 
    name: 'total_ganado',
    precision: 10, 
    scale: 2, 
    default: 0 
  })
  totalGanado: number;

  @Column({ name: 'fecha_ultimo_pago', type: 'timestamp', nullable: true })
  fechaUltimoPago: Date;

  @Column({ 
    name: 'estado_cuenta',
    length: 20,
    default: 'activo'
  })
  estadoCuenta: string;

  @Column({ 
    name: 'bloqueado_por_deuda',
    default: false 
  })
  bloqueadoPorDeuda: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trabajador_id' })
  trabajador: User;

  // Métodos de utilidad
  puedeTrabajar(): boolean {
    return !this.bloqueadoPorDeuda && this.estadoCuenta === 'activo';
  }

  actualizarDeuda(monto: number): void {
    this.saldoComisionesPendientes += monto;
    this.bloqueadoPorDeuda = this.saldoComisionesPendientes > 50;
  }
}