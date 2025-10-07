import { IsString, IsOptional } from 'class-validator';

export class UpdateCoverPhotoDto {
  @IsString()
  @IsOptional()
  foto_portada?: string;

  @IsString()
  @IsOptional()
  tipo_foto_portada?: string;
}