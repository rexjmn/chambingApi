import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { CreateDocumentoDto } from './create-documento.dto';

export class UpdateDocumentoDto extends PartialType(CreateDocumentoDto) {
  @IsString()
  @IsOptional()
  estadoVerificacion?: string;
}