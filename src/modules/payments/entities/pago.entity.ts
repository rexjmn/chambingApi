import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TransaccionWompi } from './transaccion-wompi.entity';

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  WOMPI_TARJETA = 'wompi_tarjeta',
  WOMPI_BITCOIN = 'wompi_bitcoin',
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'contrato_id' })
  contratoId: string;

  @Column({ name: 'trabajador_id' })
  trabajadorId: string;

  @Column({ name: 'empleador_id' })
  empleadorId: string;

  @Column('decimal', { 
    name: 'monto_servicio',
    precision: 10, 
    scale: 2 
  })
  montoServicio: number;

  @Column('decimal', { 
    name: 'comision_plataforma',
    precision: 10, 
    scale: 2 
  })
  comisionPlataforma: number;

  @Column('decimal', { 
    name: 'monto_trabajador',
    precision: 10, 
    scale: 2 
  })
  montoTrabajador: number;

  @Column({
    name: 'metodo_pago',
    type: 'varchar',
    length: 30,
    enum: MetodoPago,
  })
  metodoPago: MetodoPago;

  @Column({
    name: 'estado_pago',
    type: 'varchar',
    length: 30,
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE,
  })
  estadoPago: EstadoPago;

  @Column({ 
    name: 'referencia_externa',
    length: 255,
    nullable: true 
  })
  referenciaExterna: string;

  @Column({ 
    name: 'comision_pagada',
    default: false 
  })
  comisionPagada: boolean;

  @CreateDateColumn({ name: 'fecha_pago_servicio' })
  fechaPagoServicio: Date;

  @Column({ 
    name: 'fecha_pago_comision',
    type: 'timestamp',
    nullable: true 
  })
  fechaPagoComision: Date;

  @Column('text', { nullable: true })
  notas: string;

  @OneToMany(() => TransaccionWompi, transaccion => transaccion.pago)
  transaccionesWompi: TransaccionWompi[];

  // Métodos de utilidad
  calcularComision(porcentaje: number = 10): void {
    this.comisionPlataforma = this.montoServicio * (porcentaje / 100);
    this.montoTrabajador = this.montoServicio - this.comisionPlataforma;
  }

  esMetodoElectronico(): boolean {
    return this.metodoPago !== MetodoPago.EFECTIVO;
  }
}