import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateTarifaDto {
  @IsNotEmpty()
  @IsUUID()
  categoriaId: string;

  @IsNotEmpty()
  @IsString()
  tipoTarifa: string;

  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @IsNotEmpty()
  @IsString()
  unidad: string;
}