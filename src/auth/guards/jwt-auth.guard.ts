import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
    Inject,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Use Passport's built-in authentication
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JWT Guard - Handle Request:', { 
      error: err?.message, 
      hasUser: !!user,
      info: info?.message 
    });

    // If there's an error or no user, throw an error
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }

  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {
    super();
  }

  

     
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}