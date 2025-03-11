import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolAdministrativo } from './entities/rol-administrativo.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolAdministrativoDto } from './dto/create-rol-administrativo.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(RolAdministrativo)
    private rolesAdminRepository: Repository<RolAdministrativo>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificamos si ya existe un rol con el mismo nombre
    const existingRole = await this.rolesRepository.findOne({
      where: { nombre: createRoleDto.nombre }
    });

    if (existingRole) {
      throw new ConflictException('Ya existe un rol con este nombre');
    }

    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }

  async assignRoleToUser(createRolAdminDto: CreateRolAdministrativoDto): Promise<RolAdministrativo> {
    // Verificamos si ya existe una asignación activa para este usuario y rol
    const existingAssignment = await this.rolesAdminRepository.findOne({
      where: {
        usuario: { id: createRolAdminDto.usuarioId },
        rol: { id: createRolAdminDto.rolId },
        activo: true
      }
    });

    if (existingAssignment) {
      throw new ConflictException('El usuario ya tiene este rol asignado');
    }

    const rolAdmin = this.rolesAdminRepository.create(createRolAdminDto);
    return await this.rolesAdminRepository.save(rolAdmin);
  }

  async findAll(): Promise<Role[]> {
    // Usamos QueryBuilder para tener más control sobre la consulta
    return await this.rolesRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolesAdministrativos', 'rolAdmin')
      .leftJoinAndSelect('rolAdmin.usuario', 'usuario')
      .orderBy('role.nivelAcceso', 'DESC') // Super admin tendrá el nivel más alto
      .getMany();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return await this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Rol no encontrado');
    }
  }
}