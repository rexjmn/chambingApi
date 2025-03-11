import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaServicio } from './categoria-servicio.entity';

@Entity('tarifas_categoria')
export class TarifaCategoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CategoriaServicio)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaServicio;

  @Column({ name: 'tipo_tarifa' })
  tipoTarifa: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column()
  unidad: string;
}