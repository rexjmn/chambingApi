import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerifyWorkerDto {
  @IsNotEmpty({ message: 'El campo verified es obligatorio' })
  @IsBoolean({ message: 'verified debe ser true o false' })
  verified: boolean;
}