import { SetMetadata } from '@nestjs/common';

export const USER_ROLES_KEY = 'userRoles';

/**
 * Decorador para especificar qué roles de usuario (cliente/trabajador) pueden acceder
 * Uso: @RequireUserRoles('cliente', 'trabajador')
 */
export const RequireUserRoles = (...userRoles: string[]) => 
  SetMetadata(USER_ROLES_KEY, userRoles);