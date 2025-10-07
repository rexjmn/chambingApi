import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WompiWebhookPayload } from './services/wompi.service';
import { CrearPagoDto, ProcesarPagoEfectivoDto } from './dto/crear-pago.dto';

// Interface temporal para Request (si no existe)
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async crearPago(
    @Body() dto: CrearPagoDto,
    @Req() req: AuthenticatedRequest,
  ) {
    this.logger.log(`Usuario ${req.user.id} creando pago para contrato ${dto.contratoId}`);
    
    const pago = await this.paymentsService.crearPago(dto);
    
    return {
      success: true,
      message: 'Pago creado exitosamente',
      data: pago,
    };
  }

  @Post(':id/efectivo')
  @UseGuards(JwtAuthGuard)
  async procesarPagoEfectivo(
    @Param('id') pagoId: string,
    @Body() dto: ProcesarPagoEfectivoDto,
    @Req() req: AuthenticatedRequest,
  ) {
    this.logger.log(`Usuario ${req.user.id} procesando pago efectivo ${pagoId}`);
    
    const pago = await this.paymentsService.procesarPagoEfectivo(
      pagoId,
      dto.confirmado,
      dto.notas,
    );
    
    return {
      success: true,
      message: dto.confirmado ? 'Pago confirmado' : 'Pago rechazado',
      data: pago,
    };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhookWompi(@Body() payload: WompiWebhookPayload) {
    this.logger.log(`Webhook recibido de Wompi: ${payload.transaction_id}`);
    
    try {
      await this.paymentsService.manejarWebhookWompi(payload);
      return { success: true };
    } catch (error) {
      this.logger.error('Error procesando webhook:', error);
      return { success: false, error: 'Error interno' };
    }
  }

  @Get('saldo')
  @UseGuards(JwtAuthGuard)
  async obtenerSaldo(@Req() req: AuthenticatedRequest) {
    const saldo = await this.paymentsService.obtenerSaldoTrabajador(req.user.id);
    
    return {
      success: true,
      data: {
        saldoDisponible: saldo.saldoDisponible,
        comisionesPendientes: saldo.saldoComisionesPendientes,
        totalGanado: saldo.totalGanado,
        puedeTrabajar: saldo.puedeTrabajar(),
        bloqueadoPorDeuda: saldo.bloqueadoPorDeuda,
        fechaUltimoPago: saldo.fechaUltimoPago,
      },
    };
  }

  @Get('historial')
  @UseGuards(JwtAuthGuard)
  async obtenerHistorial(
    @Req() req: AuthenticatedRequest,
    @Query('limite') limite: string = '10',
    @Query('offset') offset: string = '0',
  ) {
    const { pagos, total } = await this.paymentsService.obtenerHistorialPagos(
      req.user.id,
      parseInt(limite),
      parseInt(offset),
    );
    
    return {
      success: true,
      data: {
        pagos,
        total,
        limite: parseInt(limite),
        offset: parseInt(offset),
      },
    };
  }
}