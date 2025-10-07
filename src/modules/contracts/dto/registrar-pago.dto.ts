import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RegistrarPagoDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  monto: number;

  @IsNotEmpty()
  @IsString()
  metodoPago: string;
}
