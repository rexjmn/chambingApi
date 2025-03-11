import { IsNotEmpty, IsUUID, IsDateString, IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateContratoDto {
  @IsNotEmpty()
  @IsUUID()
  empleadorId: string;

  @IsNotEmpty()
  @IsUUID()
  trabajadorId: string;

  @IsNotEmpty()
  @IsUUID()
  categoriaId: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: Date;

  @IsDateString()
  @IsOptional()
  fechaFin?: Date;

  @IsNotEmpty()
  @IsObject()
  detallesServicio: object;

  @IsNotEmpty()
  @IsString()
  terminosCondiciones: string;

  @IsNotEmpty()
  @IsNumber()
  monto: number;
}