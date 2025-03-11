import { Repository } from 'typeorm';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { TarifaCategoria } from './entities/tarifa-categoria.entity';
import { TrabajadorCategoria } from './entities/trabajador-categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';
export declare class ServicesService {
    private categoriasRepository;
    private tarifasRepository;
    private trabajadorCategoriaRepository;
    constructor(categoriasRepository: Repository<CategoriaServicio>, tarifasRepository: Repository<TarifaCategoria>, trabajadorCategoriaRepository: Repository<TrabajadorCategoria>);
    createCategoria(createCategoriaDto: CreateCategoriaDto): Promise<CategoriaServicio>;
    createTarifa(createTarifaDto: CreateTarifaDto): Promise<TarifaCategoria>;
    assignTrabajadorToCategoria(createTrabajadorCategoriaDto: CreateTrabajadorCategoriaDto): Promise<TrabajadorCategoria>;
    findAllCategorias(): Promise<CategoriaServicio[]>;
    findCategoriaById(id: string): Promise<CategoriaServicio>;
    getTrabajadoresByCategoria(categoriaId: string): Promise<TrabajadorCategoria[]>;
    updateCategoria(id: string, updateCategoriaDto: Partial<CreateCategoriaDto>): Promise<CategoriaServicio>;
}
