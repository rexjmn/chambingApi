import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../../modules/users/entities/user.entity';
import { AuthTokens } from '../interfaces/auth-tokens.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService
  ) {}

  async generateAuthTokens(user: User, request: Request): Promise<AuthTokens> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, request);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: 900
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const roles = await this.userService.getUserRoles(user.id);
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m'
    });
  }

  private async generateRefreshToken(user: User, request: Request): Promise<RefreshToken> {
    await this.revokeUserRefreshTokens(user.id);

    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d'
      }
    );

    const refreshToken = this.refreshTokenRepo.create({
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: request.socket.remoteAddress,
      userAgent: request.headers['user-agent']
    });

    return await this.refreshTokenRepo.save(refreshToken);
  }

  async refreshAccessToken(refreshToken: string, request: Request): Promise<AuthTokens> {
    const token = await this.findAndValidateRefreshToken(refreshToken);
    
    if (!token || !token.isActive()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateAuthTokens(token.user, request);
  }

  private async findAndValidateRefreshToken(token: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { token, revoked: false },
      relations: ['user']
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return refreshToken;
  }

  private async revokeUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepo.update(
      { user: { id: userId }, revoked: false },
      { revoked: true }
    );
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const result = await this.refreshTokenRepo.update(
      { token },
      { revoked: true }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Token not found');
    }
  }
}