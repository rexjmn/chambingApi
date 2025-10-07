import { IsOptional, IsString } from 'class-validator';

export class CompletarContratoDto {
  @IsOptional()
  @IsString()
  notas?: string;
}