import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  Length,
  Matches
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  @Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' })
  apellido: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  @Matches(/^[0-9-]+$/, { message: 'Teléfono debe contener solo números y guiones' })
  telefono?: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  municipio?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsString()
  @Length(9, 10)
  @Matches(/^[0-9-]+$/, { message: 'DUI debe contener solo números y guiones' })
  dui?: string;

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  /**
   * Tipo de usuario:
   * - 'cliente' (default): Usuario que contrata servicios
   * - 'trabajador': Usuario que ofrece servicios
   */
  @IsOptional()
  @IsEnum(['cliente', 'trabajador'], { 
    message: 'tipo_usuario debe ser "cliente" o "trabajador"' 
  })
  tipo_usuario?: 'cliente' | 'trabajador';

  // Campo interno - no se valida desde el cliente
  verificado?: boolean;
}