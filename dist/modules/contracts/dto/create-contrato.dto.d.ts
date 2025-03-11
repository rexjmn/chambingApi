export declare class CreateContratoDto {
    empleadorId: string;
    trabajadorId: string;
    categoriaId: string;
    fechaInicio: Date;
    fechaFin?: Date;
    detallesServicio: object;
    terminosCondiciones: string;
    monto: number;
}
