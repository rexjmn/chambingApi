import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CategoriaServicio } from '../../services/entities/categoria-servicio.entity';
import { EstadoContrato } from './estado-contrato.entity';

@Entity('contratos')
export class Contrato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'empleador_id' })
  empleador: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'trabajador_id' })
  trabajador: User;

  @ManyToOne(() => CategoriaServicio)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaServicio;

  @Column({ unique: true })
  codigo_contrato: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'timestamp' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ type: 'jsonb' })
  detalles_servicio: object;

  @Column({ type: 'text' })
  terminos_condiciones: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ nullable: true })
  codigo_qr_url: string;

  @OneToMany(() => EstadoContrato, estado => estado.contrato)
  estados: EstadoContrato[];
}
