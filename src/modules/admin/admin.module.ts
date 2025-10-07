import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
// Cuando implementes estas entidades, descomenta:
 import { Contrato } from '../contracts/entities/contrato.entity';
// import { DocumentoTrabajador } from '../documents/entities/documento-trabajador.entity';
 import { CategoriaServicio } from '../services/entities/categoria-servicio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Contrato,
      // DocumentoTrabajador,
     CategoriaServicio
    ]),
  ],
  controllers: [AdminController],
  exports: [TypeOrmModule]
})
export class AdminModule {}