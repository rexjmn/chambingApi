import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { LoginAttempt } from '../entities/login-attempt.entity';

@Injectable()
export class LoginAttemptService {
  private readonly logger = new Logger(LoginAttemptService.name);
  private readonly MAX_ATTEMPTS = 5;
  private readonly ATTEMPT_WINDOW = 30 * 60 * 1000; // 30 minutos
  private readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos

  constructor(
    @InjectRepository(LoginAttempt)
    private readonly loginAttemptRepo: Repository<LoginAttempt>
  ) {}

  async recordAttempt(
    email: string,
    ip: string,
    userAgent: string,
    successful: boolean
  ): Promise<void> {
    try {
      // Creamos un nuevo registro de intento de inicio de sesión
      const loginAttempt = new LoginAttempt();
      loginAttempt.email = email;
      loginAttempt.ipAddress = ip;
      loginAttempt.userAgent = userAgent;
      loginAttempt.successful = successful;
      // Guardamos los detalles como un objeto JSON
      loginAttempt.details = {
        timestamp: new Date().toISOString(),
        successful,
        attemptType: 'login'
      };

      await this.loginAttemptRepo.save(loginAttempt);

      if (successful) {
        // Si el intento fue exitoso, limpiamos los intentos fallidos
        await this.clearFailedAttempts(email, ip);
      } else {
        await this.handleFailedAttempt(email, ip);
      }
    } catch (error) {
      this.logger.error(
        `Error registrando intento de inicio de sesión: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  private async clearFailedAttempts(email: string, ip: string): Promise<void> {
    try {
      // Buscamos los intentos fallidos recientes
      const failedAttempts = await this.loginAttemptRepo.find({
        where: {
          email,
          ipAddress: ip,
          successful: false,
          timestamp: MoreThan(new Date(Date.now() - this.ATTEMPT_WINDOW))
        }
      });

      // Actualizamos cada intento fallido con los nuevos detalles
      for (const attempt of failedAttempts) {
        attempt.details = {
          ...attempt.details,
          resolved: true,
          resolvedAt: new Date().toISOString(),
          resolution: 'successful_login'
        };
        await this.loginAttemptRepo.save(attempt);
      }
    } catch (error) {
      this.logger.error(
        `Error limpiando intentos fallidos: ${error.message}`,
        error.stack
      );
    }
  }

  private async handleFailedAttempt(email: string, ip: string): Promise<void> {
    try {
      const recentAttempts = await this.getRecentFailedAttempts(email, ip);

      if (recentAttempts.length >= this.MAX_ATTEMPTS) {
        const blockRecord = new LoginAttempt();
        blockRecord.email = email;
        blockRecord.ipAddress = ip;
        blockRecord.successful = false;
        blockRecord.details = {
          type: 'block',
          reason: 'too_many_attempts',
          attemptCount: recentAttempts.length,
          blockTimestamp: new Date().toISOString(),
          blockDuration: this.BLOCK_DURATION,
          blockExpiresAt: new Date(Date.now() + this.BLOCK_DURATION).toISOString()
        };

        await this.loginAttemptRepo.save(blockRecord);
        this.logger.warn(
          `Cuenta bloqueada: ${email} desde IP ${ip}. ` +
          `Expira en: ${this.BLOCK_DURATION / 60000} minutos`
        );
      }
    } catch (error) {
      this.logger.error(
        `Error manejando intento fallido: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async isBlocked(email: string, ip: string): Promise<{ blocked: boolean; remainingTime?: number }> {
    try {
      const recentBlock = await this.loginAttemptRepo.findOne({
        where: {
          email,
          ipAddress: ip,
          timestamp: MoreThan(new Date(Date.now() - this.BLOCK_DURATION)),
          successful: false
        },
        order: { timestamp: 'DESC' }
      });

      if (recentBlock?.details?.type === 'block') {
        const blockExpiresAt = new Date(recentBlock.details.blockExpiresAt);
        const now = new Date();

        if (blockExpiresAt > now) {
          const remainingTime = Math.ceil((blockExpiresAt.getTime() - now.getTime()) / 60000);
          return { blocked: true, remainingTime };
        }
      }

      return { blocked: false };
    } catch (error) {
      this.logger.error(
        `Error verificando estado de bloqueo: ${error.message}`,
        error.stack
      );
      return { blocked: true }; // Por seguridad, asumimos bloqueado en caso de error
    }
  }

  private async getRecentFailedAttempts(email: string, ip: string): Promise<LoginAttempt[]> {
    return this.loginAttemptRepo.find({
      where: {
        email,
        ipAddress: ip,
        successful: false,
        timestamp: MoreThan(new Date(Date.now() - this.ATTEMPT_WINDOW))
      },
      order: { timestamp: 'DESC' }
    });
  }
  async getLoginAttemptInfo(email: string, ip: string): Promise<{
    recentAttempts: number;
    remainingAttempts: number;
    isBlocked: boolean;
    blockExpiresIn?: number;
  }> {
    try {
      // Obtenemos los intentos fallidos recientes
      const recentFailedAttempts = await this.getRecentFailedAttempts(email, ip);
      
      // Verificamos si la cuenta está bloqueada
      const blockStatus = await this.isBlocked(email, ip);

      // Calculamos los intentos restantes antes del bloqueo
      const remainingAttempts = Math.max(
        0, 
        this.MAX_ATTEMPTS - recentFailedAttempts.length
      );

      return {
        // Número de intentos fallidos recientes
        recentAttempts: recentFailedAttempts.length,
        
        // Número de intentos restantes antes del bloqueo
        remainingAttempts,
        
        // Si la cuenta está actualmente bloqueada
        isBlocked: blockStatus.blocked,
        
        // Tiempo restante del bloqueo en minutos (si está bloqueada)
        blockExpiresIn: blockStatus.remainingTime
      };
    } catch (error) {
      this.logger.error(
        `Error obteniendo información de intentos de inicio de sesión: ${error.message}`,
        error.stack
      );
      
      // En caso de error, devolvemos valores conservadores por seguridad
      return {
        recentAttempts: this.MAX_ATTEMPTS,
        remainingAttempts: 0,
        isBlocked: true
      };
    }
  }
}
