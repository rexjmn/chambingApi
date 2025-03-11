// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsOptional, Matches, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{8}-\d$/, {
    message: 'El DUI debe tener el formato: 12345678-9'
  })
  dui?: string;

  @IsOptional()
  direccion?: any;

  @IsString()
  @IsOptional()
  tipo_usuario?: string = 'regular'; // Valor por defecto

  @ValidateIf(o => o.tipo_usuario === 'trabajador')
  @IsNotEmpty({ message: 'La foto de perfil es obligatoria para trabajadores' })
  @IsOptional()
  foto_perfil?: string;

  @ValidateIf(o => o.tipo_usuario === 'trabajador')
  @IsNotEmpty({ message: 'El tipo de foto de perfil es obligatorio para trabajadores' })
  @IsOptional()
  tipo_foto_perfil?: string;

}