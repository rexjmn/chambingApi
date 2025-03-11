import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RequireRoles } from '../../auth/decorators/roles.decorator';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('categorias')
  @RequireRoles('admin', 'super_admin')
  createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.servicesService.createCategoria(createCategoriaDto);
  }

  @Post('tarifas')
  @RequireRoles('admin', 'super_admin')
  createTarifa(@Body() createTarifaDto: CreateTarifaDto) {
    return this.servicesService.createTarifa(createTarifaDto);
  }

  @Post('trabajadores/asignar')
  @RequireRoles('admin', 'super_admin')
  assignTrabajadorToCategoria(@Body() createTrabajadorCategoriaDto: CreateTrabajadorCategoriaDto) {
    return this.servicesService.assignTrabajadorToCategoria(createTrabajadorCategoriaDto);
  }

  @Get('categorias')
  findAllCategorias() {
    return this.servicesService.findAllCategorias();
  }

  @Get('categorias/:id')
  findCategoriaById(@Param('id') id: string) {
    return this.servicesService.findCategoriaById(id);
  }

  @Get('categorias/:id/trabajadores')
  getTrabajadoresByCategoria(@Param('id') id: string) {
    return this.servicesService.getTrabajadoresByCategoria(id);
  }

  @Patch('categorias/:id')
  @RequireRoles('admin', 'super_admin')
  updateCategoria(
    @Param('id') id: string,
    @Body() updateCategoriaDto: Partial<CreateCategoriaDto>
  ) {
    return this.servicesService.updateCategoria(id, updateCategoriaDto);
  }
}