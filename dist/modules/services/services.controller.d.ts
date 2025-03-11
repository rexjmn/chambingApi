import { ServicesService } from './services.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    createCategoria(createCategoriaDto: CreateCategoriaDto): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
    createTarifa(createTarifaDto: CreateTarifaDto): Promise<import("./entities/tarifa-categoria.entity").TarifaCategoria>;
    assignTrabajadorToCategoria(createTrabajadorCategoriaDto: CreateTrabajadorCategoriaDto): Promise<import("./entities/trabajador-categoria.entity").TrabajadorCategoria>;
    findAllCategorias(): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio[]>;
    findCategoriaById(id: string): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
    getTrabajadoresByCategoria(id: string): Promise<import("./entities/trabajador-categoria.entity").TrabajadorCategoria[]>;
    updateCategoria(id: string, updateCategoriaDto: Partial<CreateCategoriaDto>): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
}
