import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Este decorador nos permite especificar qué roles tienen acceso a cada endpoint
export const RequireRoles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);