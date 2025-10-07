import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pago } from './pago.entity';

@Entity('transacciones_wompi')
export class TransaccionWompi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pago_id' })
  pagoId: string;

  @Column({ 
    name: 'wompi_transaction_id',
    length: 255 
  })
  wompiTransactionId: string;

  @Column({ 
    name: 'wompi_reference',
    length: 255 
  })
  wompiReference: string;

  @Column({ 
    name: 'estado_wompi',
    length: 50 
  })
  estadoWompi: string;

  @Column('decimal', { 
    precision: 10, 
    scale: 2 
  })
  monto: number;

  @Column({ 
    length: 3,
    default: 'USD' 
  })
  divisa: string;

  @Column({ 
    name: 'metodo_pago_wompi',
    length: 50 
  })
  metodoPagoWompi: string;

  @Column('jsonb', { 
    name: 'webhook_data',
    nullable: true 
  })
  webhookData: any;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @ManyToOne(() => Pago, pago => pago.transaccionesWompi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pago_id' })
  pago: Pago;

  estaAprobada(): boolean {
    return this.estadoWompi === 'APPROVED';
  }

  estaDeclinada(): boolean {
    return this.estadoWompi === 'DECLINED';
  }
}