import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly jwtService;
    canActivate(context: ExecutionContext): Promise<boolean>;
    handleRequest(err: any, user: any, info: any): any;
    constructor(jwtService: JwtService);
    private extractTokenFromHeader;
}
export {};
