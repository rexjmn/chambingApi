import { IsNotEmpty, IsString } from 'class-validator';

export class CancelarContratoDto {
  @IsNotEmpty()
  @IsString()
  motivo: string;
}