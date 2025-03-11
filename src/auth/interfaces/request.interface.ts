import { Request as ExpressRequest } from 'express';

export interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}