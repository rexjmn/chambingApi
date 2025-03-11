import { IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateTrabajadorCategoriaDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsUUID()
  categoriaId: string;

  @IsBoolean()
  @IsOptional()
  verificado?: boolean;
}