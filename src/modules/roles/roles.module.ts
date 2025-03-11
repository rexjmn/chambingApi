import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolAdministrativo } from './entities/rol-administrativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolAdministrativo])],
  exports: [TypeOrmModule]
})
export class RolesModule {}