import { 
  IsNotEmpty, 
  IsUUID, 
  IsDateString, 
  IsNumber, 
  IsString, 
  IsObject, 
  IsOptional,
  IsIn,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class DetallesServicioDto {
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsOptional()
  @IsObject()
  coordenadas?: {
    lat: number;
    lng: number;
  };

  @IsOptional()
  @IsNumber()
  duracion_estimada_horas?: number;

  @IsOptional()
  @IsString()
  notas_adicionales?: string;
}

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
  @ValidateNested()
  @Type(() => DetallesServicioDto)
  detallesServicio: DetallesServicioDto;

  @IsNotEmpty()
  @IsString()
  terminosCondiciones: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monto: number;

  @IsOptional()
  @IsIn(['efectivo', 'tarjeta'])
  metodoPago?: string;
}
