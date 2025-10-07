import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WompiService } from './services/wompi.service';
import { Pago } from './entities/pago.entity';
import { SaldoTrabajador } from './entities/saldo-trabajador.entity';
import { TransaccionWompi } from './entities/transaccion-wompi.entity';
import { NotificacionPago } from './entities/notificacion-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pago,
      SaldoTrabajador,
      TransaccionWompi,
      NotificacionPago,
    ]),
    ConfigModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, WompiService],
  exports: [PaymentsService, WompiService],
})
export class PaymentsModule {}