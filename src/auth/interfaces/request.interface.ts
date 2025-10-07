import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

// Helper para obtener el ID del usuario desde el request
export function getUserId(request: AuthenticatedRequest): string {
  return request.user.sub;
}