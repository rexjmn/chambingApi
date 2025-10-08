export declare class AppController {
    private startTime;
    getHello(): {
        status: string;
        message: string;
        timestamp: string;
        version: string;
        endpoints: {
            auth: string;
            users: string;
            roles: string;
            services: string;
            contracts: string;
            documents: string;
        };
    };
}
