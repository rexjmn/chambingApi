import { Repository } from 'typeorm';
import { LoginAttempt } from '../entities/login-attempt.entity';
export declare class LoginAttemptService {
    private readonly loginAttemptRepo;
    private readonly logger;
    private readonly MAX_ATTEMPTS;
    private readonly ATTEMPT_WINDOW;
    private readonly BLOCK_DURATION;
    constructor(loginAttemptRepo: Repository<LoginAttempt>);
    recordAttempt(email: string, ip: string, userAgent: string, successful: boolean): Promise<void>;
    private clearFailedAttempts;
    private handleFailedAttempt;
    isBlocked(email: string, ip: string): Promise<{
        blocked: boolean;
        remainingTime?: number;
    }>;
    private getRecentFailedAttempts;
    getLoginAttemptInfo(email: string, ip: string): Promise<{
        recentAttempts: number;
        remainingAttempts: number;
        isBlocked: boolean;
        blockExpiresIn?: number;
    }>;
}
