declare class DetallesServicioDto {
    descripcion: string;
    direccion: string;
    coordenadas?: {
        lat: number;
        lng: number;
    };
    duracion_estimada_horas?: number;
    notas_adicionales?: string;
}
export declare class CreateContratoDto {
    empleadorId: string;
    trabajadorId: string;
    categoriaId: string;
    fechaInicio: Date;
    fechaFin?: Date;
    detallesServicio: DetallesServicioDto;
    terminosCondiciones: string;
    monto: number;
    metodoPago?: string;
}
export {};
