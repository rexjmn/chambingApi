import { 
  IsNotEmpty, 
  IsString, 
  IsIn, 
  ValidateIf 
} from 'class-validator';

export class ActivarContratoDto {
  @IsNotEmpty()
  @IsIn(['pin', 'qr'])
  metodoActivacion: 'pin' | 'qr';

  /**
   * Código del contrato (requerido para activación por PIN)
   */
  @ValidateIf(o => o.metodoActivacion === 'pin')
  @IsNotEmpty()
  @IsString()
  codigoContrato?: string;

  /**
   * PIN de 6 dígitos (requerido para activación por PIN)
   */
  @ValidateIf(o => o.metodoActivacion === 'pin')
  @IsNotEmpty()
  @IsString()
  pin?: string;

  /**
   * Datos codificados del QR (requerido para activación por QR)
   */
  @ValidateIf(o => o.metodoActivacion === 'qr')
  @IsNotEmpty()
  @IsString()
  qrData?: string;
}

