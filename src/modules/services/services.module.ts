import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { TarifaCategoria } from './entities/tarifa-categoria.entity';
import { TrabajadorCategoria } from './entities/trabajador-categoria.entity';
import { TarifaTrabajador } from './entities/tarifa-trabajador.entity'; // ⬅️ AGREGAR
import { User } from '../users/entities/user.entity'; // ⬅️ AGREGAR

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriaServicio,
      TarifaCategoria,
      TrabajadorCategoria,
      TarifaTrabajador, // ⬅️ AGREGAR
      User,            // ⬅️ AGREGAR
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}