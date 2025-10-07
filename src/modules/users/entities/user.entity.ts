// src/modules/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { RolAdministrativo } from '../../roles/entities/rol-administrativo.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { TarifaTrabajador } from '../../services/entities/tarifa-trabajador.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  departamento: string;

  @Column({ length: 100, nullable: true })
  municipio: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  titulo_profesional: string;

  @Column({ type: 'text', nullable: true })
  biografia: string;

  @Column({ length: 10, nullable: true })
  dui: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  foto_perfil: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo_foto_perfil: string | null;

  @Column({ name: 'foto_portada', type: 'varchar', length: 500, nullable: true })
  foto_portada: string | null;

  @Column({ name: 'tipo_foto_portada', type: 'varchar', length: 100, nullable: true })
  tipo_foto_portada: string | null;


  @Column({
    type: 'varchar',
    length: 20,
    default: 'cliente'
  })
  tipo_usuario: string;


  @Column({
    name: 'verificado',
    type: 'boolean',
    default: false
  })
  verificado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_registro: Date;

  @OneToMany(() => RolAdministrativo, rolAdmin => rolAdmin.usuario)
  rolesAdministrativos: RolAdministrativo[];

  @OneToMany(() => TarifaTrabajador, tarifa => tarifa.trabajador)
  tarifas: TarifaTrabajador[];
  /**
   * Habilidades (solo para trabajadores)
   */
  @ManyToMany(() => Skill, skill => skill.usuarios)
  @JoinTable({
    name: 'usuario_habilidades',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'habilidad_id', referencedColumnName: 'id' }
  })
  habilidades: Skill[];

  // ========== MÉTODOS HELPER ==========

  /**
   * Verifica si el usuario es trabajador
   */
  isWorker(): boolean {
    return this.tipo_usuario === 'trabajador';
  }

  /**
   * Verifica si el usuario es cliente
   */
  isClient(): boolean {
    return this.tipo_usuario === 'cliente';
  }

  /**
   * Verifica si el usuario es trabajador verificado
   */
  isVerifiedWorker(): boolean {
    return this.isWorker() && this.verificado;
  }

  /**
   * Obtiene roles administrativos activos
   */
  getAdminRoles(): string[] {
    return this.rolesAdministrativos
      ?.filter(ra => ra.activo)
      ?.map(ra => ra.rol.nombre) || [];
  }

  /**
   * Verifica si es administrador (admin o super_admin)
   */
  isAdmin(): boolean {
    const roles = this.getAdminRoles();
    return roles.includes('admin') || roles.includes('super_admin');
  }

  /**
   * Verifica si es super administrador
   */
  isSuperAdmin(): boolean {
    const roles = this.getAdminRoles();
    return roles.includes('super_admin');
  }

  /**
   * Verifica si tiene un rol administrativo específico
   */
  hasAdminRole(roleName: string): boolean {
    return this.getAdminRoles().includes(roleName);
  }
}