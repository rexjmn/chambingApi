// src/modules/users/users.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly awsService: AwsService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });
    
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Determinar tipo de usuario
    const tipoUsuario = createUserDto.tipo_usuario || 'cliente';
    
    // Los trabajadores pueden subir su foto después desde su perfil
    // La foto será requerida antes de ser verificados por un admin

    const user = this.usersRepository.create({
      ...createUserDto,
      tipo_usuario: tipoUsuario,
      verificado: false,
      activo: true
    });
    
    return await this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['rolesAdministrativos', 'rolesAdministrativos.rol', 'habilidades']
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: [
        'id', 'nombre', 'apellido', 'email', 'telefono', 'dui', 
        'tipo_usuario', 'verificado', 'fecha_registro', 'foto_perfil', 
        'foto_portada', 'activo', 'departamento', 'municipio'
      ],
      order: { fecha_registro: 'DESC' }
    });
  }

  /**
   * Obtener solo trabajadores
   */
  async findAllWorkers(onlyVerified: boolean = false): Promise<User[]> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.tipo_usuario = :tipo', { tipo: 'trabajador' })
      .andWhere('user.activo = :activo', { activo: true })
      .leftJoinAndSelect('user.habilidades', 'habilidades')
      .orderBy('user.fecha_registro', 'DESC');

    if (onlyVerified) {
      query.andWhere('user.verificado = :verificado', { verificado: true });
    }

    return await query.getMany();
  }

  async getPublicProfile(userId: string) {
  const user = await this.usersRepository.findOne({
    where: { id: userId, activo: true },
    relations: ['habilidades', 'tarifas'],
    select: [
      'id', 'nombre', 'apellido', 'email', 'telefono',
      'departamento', 'municipio', 'biografia', 
      'foto_perfil', 'foto_portada', 'tipo_usuario', 
      'verificado', 'fecha_registro', 'titulo_profesional'
    ]
  });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  // Filtrar solo tarifas activas
  const tarifasActivas = user.tarifas?.filter(t => t.activo) || [];

  return {
    status: 'success',
    data: {
      ...user,
      // Solo devolver una tarifa (la más reciente si hay varias)
      tarifas: tarifasActivas.length > 0 ? tarifasActivas[0] : null
    }
  };
}

  /**
   * Obtener trabajadores pendientes de verificación
   */
  async findPendingWorkers(): Promise<User[]> {
    return await this.usersRepository.find({
      where: {
        tipo_usuario: 'trabajador',
        verificado: false,
        activo: true
      },
      order: { fecha_registro: 'ASC' }
    });
  }
  async getVerifiedWorkers(filters: {
  tipoUsuario?: string;
  verificado?: boolean;
  categoria?: string;
  departamento?: string;
  search?: string;
}): Promise<User[]> {
  const query = this.usersRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.habilidades', 'habilidades')
    .where('user.activo = :activo', { activo: true })
    .orderBy('user.fecha_registro', 'DESC');

  // Filtro por tipo de usuario (por defecto: trabajador)
  const tipoUsuario = filters.tipoUsuario || 'trabajador';
  query.andWhere('user.tipo_usuario = :tipo', { tipo: tipoUsuario });

  // Filtro por verificación (por defecto: solo verificados)
  const verificado = filters.verificado !== undefined ? filters.verificado : true;
  query.andWhere('user.verificado = :verificado', { verificado });

  // Filtro por departamento
  if (filters.departamento) {
    query.andWhere('user.departamento = :departamento', { 
      departamento: filters.departamento 
    });
  }

  // Filtro por búsqueda de texto (nombre, apellido, biografía)
  if (filters.search && filters.search.trim()) {
    query.andWhere(
      '(LOWER(user.nombre) LIKE LOWER(:search) OR ' +
      'LOWER(user.apellido) LIKE LOWER(:search) OR ' +
      'LOWER(user.titulo_profesional) LIKE LOWER(:search) OR ' +
      'LOWER(user.biografia) LIKE LOWER(:search))',
      { search: `%${filters.search.trim()}%` }
    );
  }

  // Filtro por categoría/habilidad
  if (filters.categoria) {
    query.andWhere(
      'EXISTS (' +
      'SELECT 1 FROM usuario_habilidades uh ' +
      'INNER JOIN habilidades h ON h.id = uh.habilidad_id ' +
      'WHERE uh.usuario_id = user.id ' +
      'AND (LOWER(h.nombre) LIKE LOWER(:categoria) OR LOWER(h.categoria) LIKE LOWER(:categoria))' +
      ')',
      { categoria: `%${filters.categoria}%` }
    );
  }

  const users = await query.getMany();

  // Opcionalmente, aquí podrías agregar stats de contratos/reviews
  // por ahora retornamos los usuarios con sus habilidades
  return users;
}

  /**
   * Verificar un trabajador (solo admin)
   */
  async verifyWorker(workerId: string, verified: boolean): Promise<User> {
    const user = await this.findOne(workerId);

    if (user.tipo_usuario !== 'trabajador') {
      throw new BadRequestException('Solo los trabajadores pueden ser verificados');
    }

    user.verificado = verified;
    return await this.usersRepository.save(user);
  }

  

  /**
   * Cambiar tipo de usuario (cliente <-> trabajador)
   */
  async changeUserType(
    userId: string, 
    newType: 'cliente' | 'trabajador'
  ): Promise<User> {
    const user = await this.findOne(userId);

    // Si cambia a trabajador, validar foto de perfil
    if (newType === 'trabajador' && !user.foto_perfil) {
      throw new BadRequestException(
        'Debe tener foto de perfil para convertirse en trabajador'
      );
    }

    user.tipo_usuario = newType;
    
    // Si cambia a trabajador, debe ser verificado
    if (newType === 'trabajador') {
      user.verificado = false;
    }

    return await this.usersRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(userId);
    
    // Campos permitidos para actualizar por el usuario
    const allowedFields = [
      'nombre', 'apellido', 'telefono', 'biografia', 
      'departamento', 'municipio', 'direccion'
    ];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  /**
   * Obtener roles administrativos del usuario
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.rolesAdministrativos
      ?.filter(ra => ra.activo)
      ?.map(ra => ra.rol.nombre) || [];
  }

  // ========== GESTIÓN DE FOTOS ==========

  async updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findOne(userId);

    try {
      // Eliminar foto antigua de S3 si existe
      if (user.foto_perfil) {
        const oldKey = this.getKeyFromUrl(user.foto_perfil);
        if (oldKey) {
          try {
            await this.awsService.deleteFile(oldKey);
          } catch (error) {
            console.warn(`No se pudo eliminar foto antigua: ${error.message}`);
          }
        }
      }

      // Subir nueva foto a S3
      const { fileUrl } = await this.awsService.uploadFile(file);
      
      user.foto_perfil = fileUrl;
      user.tipo_foto_perfil = file.mimetype;
      
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error actualizando foto de perfil:', error);
      throw new BadRequestException(`Error actualizando foto: ${error.message}`);
    }
  }

  async updateCoverPhoto(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findOne(userId);

    try {
      if (user.foto_portada) {
        const oldKey = this.getKeyFromUrl(user.foto_portada);
        if (oldKey) {
          try {
            await this.awsService.deleteFile(oldKey);
          } catch (error) {
            console.warn(`No se pudo eliminar portada antigua: ${error.message}`);
          }
        }
      }

      const { fileUrl } = await this.awsService.uploadFile(file, 'cover-photos');
      
      user.foto_portada = fileUrl;
      user.tipo_foto_portada = file.mimetype;
      
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error actualizando foto de portada:', error);
      throw new BadRequestException(`Error actualizando portada: ${error.message}`);
    }
  }

  async removeCoverPhoto(userId: string): Promise<User> {
    const user = await this.findOne(userId);

    try {
      if (user.foto_portada) {
        const oldKey = this.getKeyFromUrl(user.foto_portada);
        if (oldKey) {
          try {
            await this.awsService.deleteFile(oldKey);
          } catch (error) {
            console.warn(`No se pudo eliminar portada: ${error.message}`);
          }
        }
      }

      user.foto_portada = null;
      user.tipo_foto_portada = null;
      
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error eliminando foto de portada:', error);
      throw new BadRequestException(`Error eliminando portada: ${error.message}`);
    }
  }

  private getKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch (error) {
      console.warn(`URL inválida: ${url}`);
      return null;
    }
  }

  // ========== GESTIÓN DE HABILIDADES ==========

  async updateUserSkills(userId: string, skillIds: string[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['habilidades']
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.tipo_usuario !== 'trabajador') {
      throw new BadRequestException('Solo los trabajadores pueden tener habilidades');
    }

    // Limpiar habilidades actuales
    const currentSkills = user.habilidades || [];
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'habilidades')
      .of(user)
      .remove(currentSkills);

    // Agregar nuevas habilidades
    if (skillIds.length > 0) {
      await this.usersRepository
        .createQueryBuilder()
        .relation(User, 'habilidades')
        .of(user)
        .add(skillIds);
    }

    return await this.findOne(userId);
  }
}