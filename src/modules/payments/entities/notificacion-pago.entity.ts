import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TipoNotificacion {
  COMISION_PENDIENTE = 'comision_pendiente',
  PAGO_RECIBIDO = 'pago_recibido',
  CUENTA_BLOQUEADA = 'cuenta_bloqueada',
  PAGO_FALLIDO = 'pago_fallido',
  RECORDATORIO_DEUDA = 'recordatorio_deuda',
}

@Entity('notificaciones_pago')
export class NotificacionPago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @Column({
    length: 50,
    enum: TipoNotificacion,
  })
  tipo: TipoNotificacion;

  @Column({ length: 255 })
  titulo: string;

  @Column('text')
  mensaje: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ 
    name: 'enviada_email',
    default: false 
  })
  enviadaEmail: boolean;

  @Column('jsonb', { 
    name: 'datos_adicionales',
    nullable: true 
  })
  datosAdicionales: any;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  marcarComoLeida(): void {
    this.leida = true;
  }

  marcarEmailEnviado(): void {
    this.enviadaEmail = true;
  }
}