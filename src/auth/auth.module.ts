import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../modules/users/users.module';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginAttempt } from './entities/login-attempt.entity';
import { TokenService } from './services/token.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, LoginAttempt]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    TokenService, 
    LoginAttemptService,
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService, TokenService, LoginAttemptService],
})
export class AuthModule {}