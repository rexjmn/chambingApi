import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { TarifaCategoria } from './entities/tarifa-categoria.entity';
import { TrabajadorCategoria } from './entities/trabajador-categoria.entity';
import { User } from '../users/entities/user.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';
import { TarifaTrabajador } from './entities/tarifa-trabajador.entity';
import { CreateTarifaTrabajadorDto, UpdateTarifaTrabajadorDto } from './dto/create-tarifa-trabajador.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(CategoriaServicio)
    private categoriasRepository: Repository<CategoriaServicio>,
    @InjectRepository(TarifaCategoria)
    private tarifasRepository: Repository<TarifaCategoria>,
    @InjectRepository(TrabajadorCategoria)
    private trabajadorCategoriaRepository: Repository<TrabajadorCategoria>,
    @InjectRepository(TarifaTrabajador) // ⬅️ AGREGAR
    private tarifasTrabajadorRepository: Repository<TarifaTrabajador>,
    @InjectRepository(User) // ⬅️ AGREGAR
    private usersRepository: Repository<User>,
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
  async deleteCategoria(id: string): Promise<void> {
  const categoria = await this.findCategoriaById(id);
  await this.categoriasRepository.remove(categoria);
}

async createTarifaTrabajador(dto: CreateTarifaTrabajadorDto): Promise<TarifaTrabajador> {
  // Verificar que el trabajador existe y es trabajador
  const trabajador = await this.usersRepository.findOne({
    where: { id: dto.trabajadorId, tipo_usuario: 'trabajador' }
  });

  if (!trabajador) {
    throw new NotFoundException('Trabajador no encontrado');
  }

  // Verificar si ya tiene tarifas
  const existingTarifa = await this.tarifasTrabajadorRepository.findOne({
    where: { trabajador: { id: dto.trabajadorId }, activo: true }
  });

  if (existingTarifa) {
    throw new ConflictException('El trabajador ya tiene tarifas activas. Usa el endpoint de actualización.');
  }

  const tarifa = this.tarifasTrabajadorRepository.create({
    ...dto,
    trabajador
  });

  return await this.tarifasTrabajadorRepository.save(tarifa);
}

async updateTarifaTrabajador(
  trabajadorId: string, 
  dto: UpdateTarifaTrabajadorDto
): Promise<TarifaTrabajador> {
  const tarifa = await this.tarifasTrabajadorRepository.findOne({
    where: { trabajador: { id: trabajadorId }, activo: true }
  });

  if (!tarifa) {
    throw new NotFoundException('Tarifas no encontradas para este trabajador');
  }

  Object.assign(tarifa, dto);
  return await this.tarifasTrabajadorRepository.save(tarifa);
}

async getTarifasByTrabajador(trabajadorId: string): Promise<TarifaTrabajador | null> {
  const tarifa = await this.tarifasTrabajadorRepository.findOne({
    where: { trabajador: { id: trabajadorId }, activo: true },
    relations: ['trabajador']
  });

  return tarifa; // Ahora puede retornar null sin error
}

async deleteTarifaTrabajador(trabajadorId: string): Promise<void> {
  const tarifa = await this.getTarifasByTrabajador(trabajadorId);
  
  if (!tarifa) {
    throw new NotFoundException('Tarifas no encontradas');
  }

  // Soft delete
  tarifa.activo = false;
  await this.tarifasTrabajadorRepository.save(tarifa);
}

}