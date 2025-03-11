import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('documentos_trabajador')
export class DocumentoTrabajador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'tipo_documento' })
  tipoDocumento: string;

  @Column({ name: 'url_documento' })
  urlDocumento: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_carga: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_vencimiento: Date;

  @Column({ name: 'estado_verificacion', default: 'pendiente' })
  estadoVerificacion: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'verificador_id' })
  verificador: User;
}