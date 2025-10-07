import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeUserTypeDto {
  @IsNotEmpty({ message: 'El tipo de usuario es obligatorio' })
  @IsEnum(['cliente', 'trabajador'], {
    message: 'tipo_usuario debe ser "cliente" o "trabajador"'
  })
  tipo_usuario: 'cliente' | 'trabajador';
}