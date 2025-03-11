import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfilePhotoDto } from './dto/update-profile-photo.dto'; 
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly awsService: AwsService
  ) {}

  async updateProfilePhoto(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findOne(userId);

    try {
      // Si el usuario ya tiene una foto, eliminarla de S3
      if (user.foto_perfil) {
        const oldKey = this.getKeyFromUrl(user.foto_perfil);
        if (oldKey) {
          await this.awsService.deleteFile(oldKey);
        }
      }

      // Subir nueva foto
      const { fileUrl } = await this.awsService.uploadFile(file);
      
      // Actualizar usuario
      user.foto_perfil = fileUrl;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Error actualizando foto de perfil');
    }
  }

  private getKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch {
      return null;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });
  
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
    if (createUserDto.tipo_usuario === 'trabajador' && !createUserDto.foto_perfil) {
      throw new BadRequestException('La foto de perfil es obligatoria para trabajadores');
    }
  
    const user = this.usersRepository.create({
      ...createUserDto,
      tipo_usuario: createUserDto.tipo_usuario || 'regular', // Aseguramos que siempre tenga un valor
      activo: true
    });
    
    return await this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
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

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['rolesAdministrativos', 'rolesAdministrativos.rol']
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.rolesAdministrativos
      .filter(ra => ra.activo)
      .map(ra => ra.rol.nombre);
  }
}


