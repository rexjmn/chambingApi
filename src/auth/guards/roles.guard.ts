import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  import { JwtPayload } from '../interfaces/jwt-payload.interface';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Obtenemos los roles requeridos del decorador
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      // Si no hay roles requeridos, permitimos el acceso
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user as JwtPayload;
  
      // Verificamos si el usuario existe y tiene roles
      if (!user || !user.roles) {
        throw new ForbiddenException('No tiene permisos para realizar esta acción');
      }
  
      // Verificamos si el usuario tiene alguno de los roles requeridos
      const hasRole = requiredRoles.some(role => user.roles.includes(role));
  
      if (!hasRole) {
        throw new ForbiddenException(
          `Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`
        );
      }
  
      return true;
    }
  }