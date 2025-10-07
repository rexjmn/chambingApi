import { IsOptional, IsString } from 'class-validator';

export class CerrarContratoDto {
  @IsOptional()
  @IsString()
  notas?: string;
}