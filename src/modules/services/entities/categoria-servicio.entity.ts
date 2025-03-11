import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrabajadorCategoria } from './trabajador-categoria.entity';
import { TarifaCategoria } from './tarifa-categoria.entity';

@Entity('categorias_servicio')
export class CategoriaServicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'jsonb', name: 'requisitos_documentos' })
  requisitosDocumentos: object;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => TrabajadorCategoria, trabajadorCat => trabajadorCat.categoria)
  trabajadoresCategorias: TrabajadorCategoria[];

  @OneToMany(() => TarifaCategoria, tarifa => tarifa.categoria)
  tarifas: TarifaCategoria[];
}
