import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../../modules/users/entities/user.entity';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { UsersService } from '../../modules/users/users.service';
export declare class TokenService {
    private refreshTokenRepo;
    private jwtService;
    private configService;
    private userService;
    constructor(refreshTokenRepo: Repository<RefreshToken>, jwtService: JwtService, configService: ConfigService, userService: UsersService);
    generateAuthTokens(user: User, request: Request): Promise<AuthTokens>;
    private generateAccessToken;
    private generateRefreshToken;
    refreshAccessToken(refreshToken: string, request: Request): Promise<AuthTokens>;
    private findAndValidateRefreshToken;
    private revokeUserRefreshTokens;
    revokeRefreshToken(token: string): Promise<void>;
}
