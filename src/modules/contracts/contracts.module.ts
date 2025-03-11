import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Contrato } from './entities/contrato.entity';
import { EstadoContrato } from './entities/estado-contrato.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contrato, EstadoContrato])
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService]
})
export class ContractsModule {}