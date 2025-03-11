import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from './role.entity';

@Entity('roles_administrativos')
export class RolAdministrativo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'asignado_por' })
  asignadoPor: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_asignacion: Date;

  @Column({ default: true })
  activo: boolean;
}