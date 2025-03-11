import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Query, 
    UseGuards 
  } from '@nestjs/common';
  import { ContractsService } from './contracts.service';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../../auth/guards/roles.guard';
  import { RequireRoles } from '../../auth/decorators/roles.decorator';
  import { CreateContratoDto } from './dto/create-contrato.dto';
  
  @Controller('contracts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}
  
    @Post()
    @RequireRoles('empleador', 'admin', 'super_admin')
    create(@Body() createContratoDto: CreateContratoDto) {
      return this.contractsService.create(createContratoDto);
    }
  
    @Get()
    findAll(
      @Query('empleadorId') empleadorId?: string,
      @Query('trabajadorId') trabajadorId?: string,
      @Query('estado') estado?: string,
      @Query('fechaInicio') fechaInicio?: Date,
      @Query('fechaFin') fechaFin?: Date
    ) {
      return this.contractsService.findAll({
        empleadorId,
        trabajadorId,
        estado,
        fechaInicio,
        fechaFin
      });
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.contractsService.findOne(id);
    }
  
    @Post(':id/estado')
    @RequireRoles('empleador', 'admin', 'super_admin')
    updateEstado(
      @Param('id') id: string,
      @Body() data: { nuevoEstado: string; usuarioId: string; notas?: string }
    ) {
      return this.contractsService.updateEstado(
        id,
        data.nuevoEstado,
        data.usuarioId,
        data.notas
      );
    }
  
    @Get(':id/historial')
    getHistorialEstados(@Param('id') id: string) {
      return this.contractsService.getHistorialEstados(id);
    }
  }