// src/modules/contracts/contracts.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query, 
  UseGuards,
  Req,
  Ip
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RequireRoles } from '../../auth/decorators/roles.decorator';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { ActivarContratoDto } from './dto/activar-contrato.dto';
import { CompletarContratoDto } from './dto/completar-contrato.dto';
import { CancelarContratoDto } from './dto/cancelar-contrato.dto';
import { CerrarContratoDto } from './dto/cerrar-contrato.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  // ========== CREAR CONTRATO ==========
  
  /**
   * Crea un nuevo contrato
   * Solo clientes pueden crear contratos
   */
  @Post()
  async create(
    @Body() createContratoDto: CreateContratoDto,
    @Req() req: RequestWithUser
  ) {
    try {
      const contrato = await this.contractsService.create(createContratoDto);
      
      return {
        status: 'success',
        message: 'Contrato creado exitosamente',
        data: {
          id: contrato.id,
          codigo_contrato: contrato.codigo_contrato,
          pin_activacion: contrato.pin_activacion,
          codigo_qr_url: contrato.codigo_qr_url,
          estado: contrato.estado,
          monto_total: contrato.monto_total,
          monto_trabajador: contrato.monto_trabajador,
          fecha_inicio_programada: contrato.fecha_inicio_programada,
          empleador: {
            id: contrato.empleador.id,
            nombre: contrato.empleador.nombre,
            apellido: contrato.empleador.apellido
          },
          trabajador: {
            id: contrato.trabajador.id,
            nombre: contrato.trabajador.nombre,
            apellido: contrato.trabajador.apellido
          }
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  // ========== ACTIVAR CONTRATO ==========
  
  /**
   * Activa un contrato usando PIN o QR
   * Tanto empleador como trabajador pueden activar
   */
  @Post('activar')
  async activarContrato(
    @Body() activarDto: ActivarContratoDto,
    @Req() req: RequestWithUser,
    @Ip() ip: string
  ) {
    try {
      const contrato = await this.contractsService.activarContrato(
        activarDto,
        req.user.id,
        ip
      );

      return {
        status: 'success',
        message: '¡Contrato activado exitosamente! El trabajo puede comenzar.',
        data: {
          id: contrato.id,
          codigo_contrato: contrato.codigo_contrato,
          estado: contrato.estado,
          fecha_activacion: contrato.fecha_activacion,
          activado_por: contrato.activado_por,
          metodo_activacion: contrato.metodo_activacion,
          estado_pago: contrato.estado_pago
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  // ========== COMPLETAR CONTRATO ==========
  
  /**
   * Marca el contrato como completado
   * Solo el trabajador puede marcar como completado
   */
  @Patch(':id/completar')
  async completarContrato(
    @Param('id') id: string,
    @Body() completarDto: CompletarContratoDto,
    @Req() req: RequestWithUser
  ) {
    try {
      const contrato = await this.contractsService.completarContrato(
        id,
        req.user.id,
        completarDto.notas
      );

      return {
        status: 'success',
        message: 'Trabajo marcado como completado. Esperando confirmación del cliente.',
        data: {
          id: contrato.id,
          estado: contrato.estado,
          fecha_completado: contrato.fecha_completado
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  // ========== CERRAR CONTRATO (LIBERAR PAGO) ==========
  
  /**
   * Cierra el contrato y libera el pago
   * Solo el empleador puede cerrar
   */
  @Patch(':id/cerrar')
  async cerrarContrato(
    @Param('id') id: string,
    @Body() cerrarDto: CerrarContratoDto,
    @Req() req: RequestWithUser
  ) {
    try {
      const contrato = await this.contractsService.cerrarContrato(
        id,
        req.user.id,
        cerrarDto.notas
      );

      return {
        status: 'success',
        message: 'Contrato cerrado y pago liberado al trabajador.',
        data: {
          id: contrato.id,
          estado: contrato.estado,
          estado_pago: contrato.estado_pago,
          fecha_cierre: contrato.fecha_cierre,
          monto_trabajador: contrato.monto_trabajador
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  // ========== CANCELAR CONTRATO ==========
  
  /**
   * Cancela el contrato
   * Tanto empleador como trabajador pueden cancelar
   */
  @Patch(':id/cancelar')
  async cancelarContrato(
    @Param('id') id: string,
    @Body() cancelarDto: CancelarContratoDto,
    @Req() req: RequestWithUser
  ) {
    try {
      const contrato = await this.contractsService.cancelarContrato(
        id,
        req.user.id,
        cancelarDto.motivo
      );

      return {
        status: 'success',
        message: 'Contrato cancelado exitosamente',
        data: {
          id: contrato.id,
          estado: contrato.estado,
          estado_pago: contrato.estado_pago
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  // ========== CONSULTAR CONTRATOS ==========
  
  /**
   * Lista todos los contratos con filtros
   */
  @Get()
  async findAll(
    @Query('empleadorId') empleadorId?: string,
    @Query('trabajadorId') trabajadorId?: string,
    @Query('estado') estado?: string,
    @Req() req?: RequestWithUser
  ) {
    try {
      // Si no se especifica filtro, mostrar solo los contratos del usuario
      const filters: any = {};
      
      if (empleadorId) {
        filters.empleadorId = empleadorId;
      } else if (trabajadorId) {
        filters.trabajadorId = trabajadorId;
      } else if (req?.user) {
        // Por defecto, mostrar contratos donde el usuario es parte
        // (esto se puede mejorar en el service)
      }

      if (estado) {
        filters.estado = estado;
      }

      const contratos = await this.contractsService.findAll(filters);

      return {
        status: 'success',
        data: contratos,
        count: contratos.length
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      };
    }
  }

  /**
   * Obtiene mis contratos (como empleador o trabajador)
   */
  @Get('mis-contratos')
async getMisContratos(
  @Req() req: RequestWithUser,
  @Query('rol') rol?: 'empleador' | 'trabajador',
  @Query('estado') estado?: string
) {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const filters: any = {};

    // Filtrar por rol: como empleador o trabajador
    if (rol === 'empleador') {
      filters.empleadorId = userId;
    } else if (rol === 'trabajador') {
      filters.trabajadorId = userId;
    } else {
      // Si no especifica rol, buscar donde sea empleador O trabajador
      // Esto requiere una query más compleja
      const contratosComoEmpleador = await this.contractsService.findAll({
        empleadorId: userId,
        estado
      });
      
      const contratosComoTrabajador = await this.contractsService.findAll({
        trabajadorId: userId,
        estado
      });
      
      const todosLosContratos = [...contratosComoEmpleador, ...contratosComoTrabajador];
      
      return {
        status: 'success',
        data: todosLosContratos,
        count: todosLosContratos.length
      };
    }

    if (estado) {
      filters.estado = estado;
    }

    const contratos = await this.contractsService.findAll(filters);

    return {
      status: 'success',
      data: contratos,
      count: contratos.length
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      data: []
    };
  }
}

  /**
   * Obtiene un contrato específico por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const contrato = await this.contractsService.findOne(id);

      return {
        status: 'success',
        data: contrato
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  /**
   * Busca contrato por código
   */
  @Get('codigo/:codigo')
  async findByCodigoContrato(@Param('codigo') codigo: string) {
    try {
      const contrato = await this.contractsService.findByCodigoContrato(codigo);

      return {
        status: 'success',
        data: contrato
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null
      };
    }
  }

  // ========== HISTORIAL DE ESTADOS ==========
  
  /**
   * Obtiene el historial de cambios de estado de un contrato
   */
  @Get(':id/historial')
  async getHistorialEstados(@Param('id') id: string) {
    try {
      const historial = await this.contractsService.getHistorialEstados(id);

      return {
        status: 'success',
        data: historial
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      };
    }
  }

  // ========== ENDPOINTS ADMINISTRATIVOS ==========

  /**
   * Obtiene todos los contratos (solo admin)
   */
  @Get('admin/todos')
  @UseGuards(RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async getAllContracts(
    @Query('estado') estado?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    try {
      const filters: any = {};
      if (estado) {
        filters.estado = estado;
      }

      const contratos = await this.contractsService.findAll(filters);

      return {
        status: 'success',
        data: contratos,
        count: contratos.length,
        page,
        limit
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      };
    }
  }
}