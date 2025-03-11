// src/modules/users/users.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as bcrypt from 'bcrypt';
import { Request, Express } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
  }))
  async updateProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser
  ) {
    console.log('Token:', req.headers.authorization);
  console.log('User:', req.user);
    try {
      const updatedUser = await this.usersService.updateProfilePhoto(
        req.user.id,
        file
      );

      return {
        status: 'success',
        message: 'Foto de perfil actualizada exitosamente',
        data: {
          id: updatedUser.id,
          foto_perfil: updatedUser.foto_perfil,
          updatedAt: new Date()
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Hash de la contraseña antes de crear el usuario
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Crear usuario con la contraseña hasheada
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    });

    // Retornar el usuario sin la contraseña
    const { password, ...result } = user;
    return {
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: result
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    const user = await this.usersService.findOne(req.user.id);
    const { password, ...result } = user;
    return {
      status: 'success',
      data: result
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithUser) {
    const user = await this.usersService.findOne(req.user.id);
    const { password, ...result } = user;
    return {
      status: 'success',
      data: {
        ...result,
        roles: await this.usersService.getUserRoles(req.user.id)
      }
    };
  }
}