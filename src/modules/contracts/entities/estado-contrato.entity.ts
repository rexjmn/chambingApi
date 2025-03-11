import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Contrato } from './contrato.entity';
import { User } from '../../users/entities/user.entity';

@Entity('estados_contrato')
export class EstadoContrato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Contrato, contrato => contrato.estados)
  @JoinColumn({ name: 'contrato_id' })
  contrato: Contrato;

  @Column({ nullable: true })
  estado_anterior: string;

  @Column()
  estado_nuevo: string;

  @CreateDateColumn()
  fecha_cambio: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'text', nullable: true })
  notas: string;
}