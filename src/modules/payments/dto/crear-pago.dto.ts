import { IsEnum, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { MetodoPago } from '../entities/pago.entity';

export class CrearPagoDto {
  @IsString()
  contratoId: string;

  @IsString()
  trabajadorId: string;

  @IsString()
  empleadorId: string;

  @IsNumber()
  @Min(1)
  montoServicio: number;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(20)
  porcentajeComision?: number;
}

export class ProcesarPagoEfectivoDto {
  confirmado: boolean;

  @IsOptional()
  @IsString()
  notas?: string;
}