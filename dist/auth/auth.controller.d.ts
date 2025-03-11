import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedRequest } from './interfaces/request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refreshToken(refreshToken: string, request: AuthenticatedRequest): Promise<import("./interfaces/auth-tokens.interface").AuthTokens>;
    logout(refreshToken: string): Promise<void>;
}
