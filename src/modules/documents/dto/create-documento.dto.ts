import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateDocumentoDto {
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @IsNotEmpty()
  @IsString()
  tipoDocumento: string;

  @IsNotEmpty()
  @IsString()
  urlDocumento: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: Date;

  @IsString()
  @IsOptional()
  estadoVerificacion?: string;

  @IsUUID()
  @IsOptional()
  verificadorId?: string;
}