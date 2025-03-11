import { IsNotEmpty, IsString, IsObject, IsBoolean, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNotEmpty()
  @IsObject()
  requisitosDocumentos: object;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}