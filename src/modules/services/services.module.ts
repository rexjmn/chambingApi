import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { TarifaCategoria } from './entities/tarifa-categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaServicio, TarifaCategoria])],
  exports: [TypeOrmModule]
})
export class ServicesModule {}