// src/modules/contracts/contracts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contrato } from './entities/contrato.entity';
import { EstadoContrato } from './entities/estado-contrato.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contrato,
      EstadoContrato
    ])
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService] // Exportar para usar en otros módulos (como Reviews)
})
export class ContractsModule {}