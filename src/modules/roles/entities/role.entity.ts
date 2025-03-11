import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolAdministrativo } from './rol-administrativo.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'nivel_acceso' })
  nivelAcceso: number;

  @Column({ type: 'jsonb' })
  permisos: object;

  @OneToMany(() => RolAdministrativo, rolAdmin => rolAdmin.rol)
  rolesAdministrativos: RolAdministrativo[];
}