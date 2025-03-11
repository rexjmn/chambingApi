import { UsersService } from '../modules/users/users.service';
import { TokenService } from './services/token.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedRequest } from './interfaces/request.interface';
export declare class AuthService {
    private usersService;
    private tokenService;
    private loginAttemptService;
    private readonly logger;
    constructor(usersService: UsersService, tokenService: TokenService, loginAttemptService: LoginAttemptService);
    private getClientInfo;
    login(loginDto: LoginDto, request: AuthenticatedRequest): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            roles: string[];
        };
    }>;
    logout(refreshToken: string): Promise<void>;
    refreshToken(refreshToken: string, request: AuthenticatedRequest): Promise<import("./interfaces/auth-tokens.interface").AuthTokens>;
}
