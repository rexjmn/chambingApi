import { Controller, Post, Body, Req, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from './interfaces/request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: AuthenticatedRequest
  ) {
    return this.authService.login(loginDto, request);
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Req() request: AuthenticatedRequest
  ) {
    return this.authService.refreshToken(refreshToken, request);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async logout(@Body('refreshToken') refreshToken: string) {
    await this.authService.logout(refreshToken);
  }
}