import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTarifaTrabajadorDto {
  @IsNotEmpty()
  @IsUUID()
  trabajadorId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_hora?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_dia?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_semana?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_mes?: number;

  @IsOptional()
  @IsString()
  moneda?: string;
}

export class UpdateTarifaTrabajadorDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_hora?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_dia?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_semana?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_mes?: number;

  @IsOptional()
  @IsString()
  moneda?: string;

  @IsOptional()
  activo?: boolean;
}