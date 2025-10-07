import { ServicesService } from './services.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';
import { CreateTarifaTrabajadorDto, UpdateTarifaTrabajadorDto } from './dto/create-tarifa-trabajador.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    testConnection(): {
        message: string;
        timestamp: string;
        status: string;
    };
    findAllCategorias(): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio[]>;
    findCategoriaById(id: string): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
    getTrabajadoresByCategoria(id: string): Promise<import("./entities/trabajador-categoria.entity").TrabajadorCategoria[]>;
    createCategoria(createCategoriaDto: CreateCategoriaDto): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
    updateCategoria(id: string, updateCategoriaDto: Partial<CreateCategoriaDto>): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
    deleteCategoria(id: string): Promise<{
        status: string;
        message: string;
    }>;
    createTarifa(createTarifaDto: CreateTarifaDto): Promise<import("./entities/tarifa-categoria.entity").TarifaCategoria>;
    createTarifaTrabajador(trabajadorId: string, dto: CreateTarifaTrabajadorDto, req: any): Promise<import("./entities/tarifa-trabajador.entity").TarifaTrabajador>;
    updateTarifaTrabajador(trabajadorId: string, dto: UpdateTarifaTrabajadorDto, req: any): Promise<import("./entities/tarifa-trabajador.entity").TarifaTrabajador>;
    getTarifasByTrabajador(trabajadorId: string): Promise<import("./entities/tarifa-trabajador.entity").TarifaTrabajador | null>;
    deleteTarifaTrabajador(trabajadorId: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
    assignTrabajadorToCategoria(createTrabajadorCategoriaDto: CreateTrabajadorCategoriaDto): Promise<import("./entities/trabajador-categoria.entity").TrabajadorCategoria>;
    findAllCategoriasAlias(): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio[]>;
    createCategoriaAlias(createCategoriaDto: CreateCategoriaDto): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
    updateCategoriaAlias(id: string, updateCategoriaDto: Partial<CreateCategoriaDto>): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio>;
}
