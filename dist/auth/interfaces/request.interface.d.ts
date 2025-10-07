import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
export declare function getUserId(request: AuthenticatedRequest): string;
