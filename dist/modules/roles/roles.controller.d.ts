import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolAdministrativoDto } from './dto/create-rol-administrativo.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<import("./entities/role.entity").Role>;
    assignRole(createRolAdminDto: CreateRolAdministrativoDto): Promise<import("./entities/rol-administrativo.entity").RolAdministrativo>;
    findAll(): Promise<import("./entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("./entities/role.entity").Role>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<import("./entities/role.entity").Role>;
    remove(id: string): Promise<void>;
}
