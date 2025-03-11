import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolAdministrativo } from './entities/rol-administrativo.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolAdministrativoDto } from './dto/create-rol-administrativo.dto';
export declare class RolesService {
    private rolesRepository;
    private rolesAdminRepository;
    constructor(rolesRepository: Repository<Role>, rolesAdminRepository: Repository<RolAdministrativo>);
    create(createRoleDto: CreateRoleDto): Promise<Role>;
    assignRoleToUser(createRolAdminDto: CreateRolAdministrativoDto): Promise<RolAdministrativo>;
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
    remove(id: string): Promise<void>;
}
