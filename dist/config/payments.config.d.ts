export declare const paymentsConfig: {
    wompi: {
        apiUrl: string;
        clientId: string | undefined;
        clientSecret: string | undefined;
        webhookSecret: string | undefined;
    };
    comisiones: {
        porcentajeDefault: number;
        limiteDeudaBloqueo: number;
        recordatorioDeudaDias: number[];
    };
    notificaciones: {
        emailEnabled: boolean;
        smsEnabled: boolean;
    };
};
