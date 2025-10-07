
import { Injectable, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { TokenService } from './services/token.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedRequest } from './interfaces/request.interface';
import * as bcrypt from 'bcrypt';

interface ClientInfo {
  ip: string;
  userAgent: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
    constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private loginAttemptService: LoginAttemptService,
  
  ) {}

  private getClientInfo(request: AuthenticatedRequest): ClientInfo {
    // Utilizamos una serie de fallbacks para asegurar que siempre tengamos un valor
    const ip = request.ip || 
               request.connection?.remoteAddress || 
               'unknown';
    
    const userAgent = request.headers['user-agent'] || 'unknown';

    return {
      ip,
      userAgent
    };
  }

  async login(loginDto: LoginDto, request: AuthenticatedRequest) {
    const clientInfo = this.getClientInfo(request);
    
    // Verificamos el estado de bloqueo
    const blockStatus = await this.loginAttemptService.isBlocked(
    loginDto.email,
    clientInfo.ip
  );

    if (blockStatus.blocked) {
      throw new UnauthorizedException(
        `Esta cuenta está temporalmente bloqueada por múltiples intentos fallidos. ` +
        `Por favor, intente nuevamente en ${blockStatus.remainingTime} minutos.`
      );
    }

    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password
      );

      if (!isPasswordValid) {
        // Registramos el intento fallido
        await this.loginAttemptService.recordAttempt(
          loginDto.email,
          clientInfo.ip,
          clientInfo.userAgent,
          false
        );

        // Obtenemos información detallada sobre los intentos
        const attemptInfo = await this.loginAttemptService.getLoginAttemptInfo(
          loginDto.email,
          clientInfo.ip
        );

        // Proporcionamos un mensaje informativo sobre los intentos restantes
        if (attemptInfo.remainingAttempts > 0) {
          throw new UnauthorizedException(
            `Credenciales inválidas. Le quedan ${attemptInfo.remainingAttempts} ` +
            `intento${attemptInfo.remainingAttempts === 1 ? '' : 's'} antes de que ` +
            `la cuenta sea bloqueada temporalmente.`
          );
        } else {
          throw new UnauthorizedException(
            'Credenciales inválidas. La cuenta ha sido bloqueada temporalmente ' +
            'por seguridad debido a múltiples intentos fallidos.'
          );
        }
      }

      // Si llegamos aquí, el inicio de sesión fue exitoso
      await this.loginAttemptService.recordAttempt(
        loginDto.email,
        clientInfo.ip,
        clientInfo.userAgent,
        true
      );

      const tokens = await this.tokenService.generateAuthTokens(user, request);

      return {
        user: {
          id: user.id,
          email: user.email,
          roles: await this.usersService.getUserRoles(user.id)
        },
        ...tokens
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.loginAttemptService.recordAttempt(
      loginDto.email,
      clientInfo.ip,
      clientInfo.userAgent,
      false
    );
      throw new UnauthorizedException('Credenciales inválidas');
      }
      this.logger.error(
        `Error en el proceso de login: ${error.message}`,
        error.stack
      );
      throw new UnauthorizedException('Error durante el proceso de autenticación');
    }
  }


  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async refreshToken(refreshToken: string, request: AuthenticatedRequest) {
    return this.tokenService.refreshAccessToken(refreshToken, request);
  }
}