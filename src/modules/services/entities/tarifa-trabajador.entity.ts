import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tarifas_trabajador')
export class TarifaTrabajador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'trabajador_id' })
  trabajador: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tarifa_hora: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tarifa_dia: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tarifa_semana: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tarifa_mes: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  moneda: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_actualizacion: Date;
}