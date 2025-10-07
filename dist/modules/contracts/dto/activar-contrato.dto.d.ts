export declare class ActivarContratoDto {
    metodoActivacion: 'pin' | 'qr';
    codigoContrato?: string;
    pin?: string;
    qrData?: string;
}
