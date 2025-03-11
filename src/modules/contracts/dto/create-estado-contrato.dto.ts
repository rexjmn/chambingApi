import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateEstadoContratoDto {
  @IsNotEmpty()
  @IsUUID()
  contratoId: string;

  @IsNotEmpty()
  @IsString()
  estadoAnterior: string;

  @IsNotEmpty()
  @IsString()
  estadoNuevo: string;

  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsString()
  @IsOptional()
  notas?: string;
}