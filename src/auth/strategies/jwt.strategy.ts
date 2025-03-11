import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      console.log('Validating payload:', payload);
      const user = await this.usersService.findOne(payload.sub);
      console.log('Found user:', user);
      
      return {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}