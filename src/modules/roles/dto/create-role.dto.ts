import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  nivelAcceso: number;

  @IsObject()
  permisos: object;
}