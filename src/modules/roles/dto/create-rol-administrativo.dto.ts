import { IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateRolAdministrativoDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  rolId: string;

  @IsNotEmpty()
  @IsUUID()
  asignadoPorId: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}