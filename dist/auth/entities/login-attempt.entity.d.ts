export declare class LoginAttempt {
    id: string;
    email: string;
    ipAddress: string;
    timestamp: Date;
    successful: boolean;
    userAgent: string;
    details: Record<string, any>;
}
