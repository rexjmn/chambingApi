import { TrabajadorCategoria } from './trabajador-categoria.entity';
import { TarifaCategoria } from './tarifa-categoria.entity';
export declare class CategoriaServicio {
    id: string;
    nombre: string;
    descripcion: string;
    requisitosDocumentos: object;
    activo: boolean;
    trabajadoresCategorias: TrabajadorCategoria[];
    tarifas: TarifaCategoria[];
}
