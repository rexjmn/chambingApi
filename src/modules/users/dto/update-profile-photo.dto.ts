import { IsOptional, IsString } from 'class-validator';

export class UpdateProfilePhotoDto {
  @IsString()
  foto_perfil: string;

  @IsString()
  tipo_foto_perfil: string;
}