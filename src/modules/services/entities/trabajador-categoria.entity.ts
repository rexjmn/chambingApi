import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaServicio } from './categoria-servicio.entity';
import { User } from '../../users/entities/user.entity';

@Entity('trabajador_categorias')
export class TrabajadorCategoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @ManyToOne(() => CategoriaServicio, categoria => categoria.trabajadoresCategorias)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaServicio;

  @Column({ default: false })
  verificado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_verificacion: Date;
}
