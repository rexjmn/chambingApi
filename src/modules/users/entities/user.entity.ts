// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolAdministrativo } from '../../roles/entities/rol-administrativo.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, default: 'regular' })
  tipo_usuario: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  dui: string;

  @Column({ default: true })
  activo: boolean;
  
  @Column({ nullable: true })
  foto_perfil: string;
  
  @Column({ nullable: true })
  tipo_foto_perfil: string;

  @OneToMany(() => RolAdministrativo, rolAdmin => rolAdmin.usuario)
  rolesAdministrativos: RolAdministrativo[];
}