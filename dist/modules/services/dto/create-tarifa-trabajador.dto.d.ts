export declare class CreateTarifaTrabajadorDto {
    trabajadorId: string;
    tarifa_hora?: number;
    tarifa_dia?: number;
    tarifa_semana?: number;
    tarifa_mes?: number;
    moneda?: string;
}
export declare class UpdateTarifaTrabajadorDto {
    tarifa_hora?: number;
    tarifa_dia?: number;
    tarifa_semana?: number;
    tarifa_mes?: number;
    moneda?: string;
    activo?: boolean;
}
