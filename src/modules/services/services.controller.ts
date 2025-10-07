import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, ForbiddenException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RequireRoles } from '../../auth/decorators/roles.decorator';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { CreateTrabajadorCategoriaDto } from './dto/create-trabajador-categoria.dto';
import { CreateTarifaTrabajadorDto, UpdateTarifaTrabajadorDto } from './dto/create-tarifa-trabajador.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  // RUTA SIN AUTENTICACIÓN - Para pruebas
  @Get('test')
  testConnection() {
    return {
      message: 'Services module is working!',
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  }

  // ============ CATEGORÍAS ============

  // RUTAS PÚBLICAS
  @Get('categories')
  findAllCategorias() {
    return this.servicesService.findAllCategorias();
  }

  @Get('categories/:id')
  findCategoriaById(@Param('id') id: string) {
    return this.servicesService.findCategoriaById(id);
  }

  @Get('categories/:id/trabajadores')
  getTrabajadoresByCategoria(@Param('id') id: string) {
    return this.servicesService.getTrabajadoresByCategoria(id);
  }

  // RUTAS CON AUTENTICACIÓN ADMIN
  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.servicesService.createCategoria(createCategoriaDto);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  updateCategoria(
    @Param('id') id: string,
    @Body() updateCategoriaDto: Partial<CreateCategoriaDto>
  ) {
    return this.servicesService.updateCategoria(id, updateCategoriaDto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async deleteCategoria(@Param('id') id: string) {
    await this.servicesService.deleteCategoria(id);
    return {
      status: 'success',
      message: 'Categoría eliminada exitosamente'
    };
  }

  // ============ TARIFAS ============

  @Post('tarifas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  createTarifa(@Body() createTarifaDto: CreateTarifaDto) {
    return this.servicesService.createTarifa(createTarifaDto);
  }

  @Post('trabajadores/:id/tarifas')
  @UseGuards(JwtAuthGuard)
  async createTarifaTrabajador(
    @Param('id') trabajadorId: string,
    @Body() dto: CreateTarifaTrabajadorDto,
    @Req() req
  ) {
    // Verificar que el usuario es el trabajador o es admin
    if (req.user.id !== trabajadorId && !req.user.roles?.includes('admin')) {
      throw new ForbiddenException('No tienes permiso para crear tarifas para este trabajador');
    }

    dto.trabajadorId = trabajadorId;
    return this.servicesService.createTarifaTrabajador(dto);
  }

  @Patch('trabajadores/:id/tarifas')
  @UseGuards(JwtAuthGuard)
  async updateTarifaTrabajador(
    @Param('id') trabajadorId: string,
    @Body() dto: UpdateTarifaTrabajadorDto,
    @Req() req
  ) {
    // Verificar permisos
    if (req.user.id !== trabajadorId && !req.user.roles?.includes('admin')) {
      throw new ForbiddenException('No tienes permiso');
    }

    return this.servicesService.updateTarifaTrabajador(trabajadorId, dto);
  }

  @Get('trabajadores/:id/tarifas')
  async getTarifasByTrabajador(@Param('id') trabajadorId: string) {
    return this.servicesService.getTarifasByTrabajador(trabajadorId);
  }

  @Delete('trabajadores/:id/tarifas')
  @UseGuards(JwtAuthGuard)
  async deleteTarifaTrabajador(
    @Param('id') trabajadorId: string,
    @Req() req
  ) {
    if (req.user.id !== trabajadorId && !req.user.roles?.includes('admin')) {
      throw new ForbiddenException('No tienes permiso');
    }

    await this.servicesService.deleteTarifaTrabajador(trabajadorId);
    return { status: 'success', message: 'Tarifas eliminadas' };
  }

  // ============ TRABAJADORES ============

  @Post('trabajadores/asignar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  assignTrabajadorToCategoria(@Body() createTrabajadorCategoriaDto: CreateTrabajadorCategoriaDto) {
    return this.servicesService.assignTrabajadorToCategoria(createTrabajadorCategoriaDto);
  }

  // ============ ALIAS PARA COMPATIBILIDAD ============
  // Mantener rutas antiguas por si las usas en otro lugar
  @Get('categorias')
  findAllCategoriasAlias() {
    return this.servicesService.findAllCategorias();
  }

  @Post('categorias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  createCategoriaAlias(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.servicesService.createCategoria(createCategoriaDto);
  }

  @Patch('categorias/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  updateCategoriaAlias(
    @Param('id') id: string,
    @Body() updateCategoriaDto: Partial<CreateCategoriaDto>
  ) {
    return this.servicesService.updateCategoria(id, updateCategoriaDto);
  }
}