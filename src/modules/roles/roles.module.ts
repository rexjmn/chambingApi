import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolAdministrativo } from './entities/rol-administrativo.entity';
import { Type } from 'class-transformer';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolAdministrativo])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, TypeOrmModule]
})
export class RolesModule { }