import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { TarifaCategoria } from './entities/tarifa-categoria.entity';
import { TrabajadorCategoria } from './entities/trabajador-categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(CategoriaServicio)
    private categoriasRepository: Repository<CategoriaServicio>,
    @InjectRepository(TarifaCategoria)
    private tarifasRepository: Repository<TarifaCategoria>,
    @InjectRepository(TrabajadorCategoria)
    private trabajadorCategoriaRepository: Repository<TrabajadorCategoria>
  ) {}

  async createCategoria(createCategoriaDto: CreateCategoriaDto): Promise<CategoriaServicio> {
    // Verificamos si la categoría ya existe por nombre
    const existingCategoria = await this.categoriasRepository.findOne({
      where: { nombre: createCategoriaDto.nombre }
    });

    if (existingCategoria) {
      throw new ConflictException('Ya existe una categoría con este nombre');
    }

    const categoria = this.categoriasRepository.create(createCategoriaDto);
    return await this.categoriasRepository.save(categoria);
  }

  async createTarifa(createTarifaDto: CreateTarifaDto): Promise<TarifaCategoria> {
    // Verificamos que la categoría existe
    const categoria = await this.categoriasRepository.findOne({
      where: { id: createTarifaDto.categoriaId }
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const tarifa = this.tarifasRepository.create({
      ...createTarifaDto,
      categoria
    });
    return await this.tarifasRepository.save(tarifa);
  }

  async assignTrabajadorToCategoria(createTrabajadorCategoriaDto: CreateTrabajadorCategoriaDto): Promise<TrabajadorCategoria> {
    // Verificamos si ya existe una asignación para este trabajador y categoría
    const existingAssignment = await this.trabajadorCategoriaRepository.findOne({
      where: {
        usuario: { id: createTrabajadorCategoriaDto.usuarioId },
        categoria: { id: createTrabajadorCategoriaDto.categoriaId }
      }
    });

    if (existingAssignment) {
      throw new ConflictException('El trabajador ya está asignado a esta categoría');
    }

    const trabajadorCategoria = this.trabajadorCategoriaRepository.create(createTrabajadorCategoriaDto);
    return await this.trabajadorCategoriaRepository.save(trabajadorCategoria);
  }

  async findAllCategorias(): Promise<CategoriaServicio[]> {
    return await this.categoriasRepository.find({
      where: { activo: true },
      relations: ['tarifas']
    });
  }

  async findCategoriaById(id: string): Promise<CategoriaServicio> {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
      relations: ['tarifas']
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async getTrabajadoresByCategoria(categoriaId: string): Promise<TrabajadorCategoria[]> {
    return await this.trabajadorCategoriaRepository.find({
      where: { categoria: { id: categoriaId }, verificado: true },
      relations: ['usuario']
    });
  }

  async updateCategoria(id: string, updateCategoriaDto: Partial<CreateCategoriaDto>): Promise<CategoriaServicio> {
    const categoria = await this.findCategoriaById(id);
    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriasRepository.save(categoria);
  }
}