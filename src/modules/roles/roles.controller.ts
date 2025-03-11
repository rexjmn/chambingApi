import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRolAdministrativoDto } from './dto/create-rol-administrativo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RequireRoles } from '../../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequireRoles('super_admin')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Post('assign')
  @RequireRoles('super_admin')
  assignRole(@Body() createRolAdminDto: CreateRolAdministrativoDto) {
    return this.rolesService.assignRoleToUser(createRolAdminDto);
  }

  @Get()
  @RequireRoles('admin', 'super_admin')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequireRoles('admin', 'super_admin')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequireRoles('super_admin')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @RequireRoles('super_admin')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}