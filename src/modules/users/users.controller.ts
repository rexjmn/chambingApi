// src/modules/users/users.controller.ts
import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RequireRoles } from '../../auth/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';
import { Request, Express } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

const imageFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
    cb(new BadRequestException('Solo se permiten imágenes'), false);
  } else {
    cb(null, true);
  }
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // ============ ENDPOINTS PÚBLICOS ============

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    });
    const { password, ...result } = user;
    return {
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: result
    };
  }

  /**
   * 🌐 Perfil público de usuario
   */
  @Get('public/:id')
  async getPublicProfile(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);

      if (!user.activo) {
        throw new NotFoundException('Usuario no disponible');
      }

      // Solo información pública (sin datos sensibles)
      const publicData = {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        foto_perfil: user.foto_perfil,
        foto_portada: user.foto_portada,
        biografia: user.biografia,
        departamento: user.departamento,
        municipio: user.municipio,
        tipo_usuario: user.tipo_usuario,
        verificado: user.tipo_usuario === 'trabajador' ? user.verificado : undefined,
        fecha_registro: user.fecha_registro,
        habilidades: user.habilidades || [],
        // Incluir teléfono para contacto si el usuario es trabajador verificado
        telefono: (user.tipo_usuario === 'trabajador' && user.verificado) ? user.telefono : undefined
      };

      return await this.usersService.getPublicProfile(id);
    } catch (error) {
      console.error('Error fetching public profile:', error);
      throw new NotFoundException('Perfil no encontrado');
    }
  }

  /**
   * 🌐 Listar trabajadores (público)
   */

  // ============ ENDPOINTS AUTENTICADOS ============

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
    try {
      const user = await this.usersService.findOne(req.user.id);
      const { password, ...userWithoutPassword } = user;
      const roles = await this.usersService.getUserRoles(req.user.id);

      return {
        status: 'success',
        data: {
          ...userWithoutPassword,
          roles, // Roles administrativos
          tipo_usuario: user.tipo_usuario, // cliente o trabajador
          verificado: user.verificado, // Solo relevante para trabajadores
          foto_perfil: user.foto_perfil || null,
          tipo_foto_perfil: user.tipo_foto_perfil || null,
          foto_portada: user.foto_portada || null,
          tipo_foto_portada: user.tipo_foto_portada || null,
          habilidades: user.habilidades || []
        }
      };
    } catch (error) {
      console.error('Error in getMe:', error);
      throw new BadRequestException('Error obteniendo datos del usuario');
    }
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: RequestWithUser, @Body() updateData: any) {
    try {
      const updatedUser = await this.usersService.updateProfile(req.user.id, updateData);
      const { password, ...result } = updatedUser;

      return {
        status: 'success',
        message: 'Perfil actualizado exitosamente',
        data: result
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new BadRequestException('Error actualizando perfil');
    }
  }

  /**
   * 🔄 Cambiar tipo de usuario (cliente -> trabajador o viceversa)
   */
  @Patch('change-type')
  @UseGuards(JwtAuthGuard)
  async changeUserType(
    @Req() req: RequestWithUser,
    @Body() body: { tipo_usuario: 'cliente' | 'trabajador' }
  ) {
    try {
      const updatedUser = await this.usersService.changeUserType(
        req.user.id,
        body.tipo_usuario
      );
      const { password, ...result } = updatedUser;

      return {
        status: 'success',
        message: `Tipo de usuario cambiado a ${body.tipo_usuario}`,
        data: result
      };
    } catch (error) {
      console.error('Error changing user type:', error);
      throw new BadRequestException(error.message);
    }
  }

  // ============ GESTIÓN DE FOTOS ============

  @Post('profile-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter,
  }))
  async updateProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ninguna imagen');
    }

    try {
      const updatedUser = await this.usersService.updateProfilePhoto(req.user.id, file);
      return {
        status: 'success',
        message: 'Foto de perfil actualizada exitosamente',
        data: {
          id: updatedUser.id,
          foto_perfil: updatedUser.foto_perfil,
          tipo_foto_perfil: updatedUser.tipo_foto_perfil,
          updatedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('cover-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFileFilter,
  }))
  async updateCoverPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ninguna imagen');
    }

    try {
      const updatedUser = await this.usersService.updateCoverPhoto(req.user.id, file);
      return {
        status: 'success',
        message: 'Foto de portada actualizada exitosamente',
        data: {
          id: updatedUser.id,
          foto_portada: updatedUser.foto_portada,
          tipo_foto_portada: updatedUser.tipo_foto_portada,
          updatedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Error updating cover photo:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete('cover-photo')
  @UseGuards(JwtAuthGuard)
  async removeCoverPhoto(@Req() req: RequestWithUser) {
    try {
      const updatedUser = await this.usersService.removeCoverPhoto(req.user.id);
      return {
        status: 'success',
        message: 'Foto de portada eliminada exitosamente',
        data: {
          id: updatedUser.id,
          foto_portada: updatedUser.foto_portada,
          tipo_foto_portada: updatedUser.tipo_foto_portada,
          updatedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Error removing cover photo:', error);
      throw new BadRequestException(error.message);
    }
  }

  // ============ GESTIÓN DE HABILIDADES ============

  @Put('profile/skills')
  @UseGuards(JwtAuthGuard)
  async updateUserSkills(@Req() req: RequestWithUser, @Body() body: { skillIds: string[] }) {
    try {
      const updatedUser = await this.usersService.updateUserSkills(req.user.id, body.skillIds);

      return {
        status: 'success',
        message: 'Habilidades actualizadas exitosamente',
        data: {
          id: updatedUser.id,
          habilidades: updatedUser.habilidades
        }
      };
    } catch (error) {
      console.error('Error updating skills:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('me/skills')
  @UseGuards(JwtAuthGuard)
  async getMySkills(@Req() req: RequestWithUser) {
    try {
      const user = await this.usersService.findOne(req.user.id);

      return {
        status: 'success',
        data: user.habilidades || []
      };
    } catch (error) {
      console.error('Error fetching user skills:', error);
      throw new BadRequestException('Error obteniendo habilidades');
    }
  }

  // ============ ENDPOINTS ADMINISTRATIVOS ============

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async findAll(
    @Query('tipo_usuario') tipoUsuario?: string,
    @Query('verificado') verificado?: string,
    @Query('departamento') departamento?: string
  ) {
    try {
      const users = await this.usersService.findAll();

      // Filtrar
      let filteredUsers = users;
      if (tipoUsuario) {
        filteredUsers = filteredUsers.filter(u => u.tipo_usuario === tipoUsuario);
      }
      if (verificado !== undefined) {
        const isVerified = verificado === 'true';
        filteredUsers = filteredUsers.filter(u => u.verificado === isVerified);
      }
      if (departamento) {
        filteredUsers = filteredUsers.filter(u => u.departamento === departamento);
      }

      const usersWithoutPassword = filteredUsers.map(({ password, ...user }) => user);

      return {
        status: 'success',
        data: usersWithoutPassword
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new BadRequestException('Error obteniendo usuarios');
    }
  }

  /**
   * 👥 Trabajadores pendientes de verificación
   */
  @Get('pending-workers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async getPendingWorkers() {
    try {
      const workers = await this.usersService.findPendingWorkers();
      const workersData = workers.map(({ password, ...worker }) => worker);

      return {
        status: 'success',
        data: workersData,
        count: workersData.length
      };
    } catch (error) {
      console.error('Error fetching pending workers:', error);
      throw new BadRequestException('Error obteniendo trabajadores pendientes');
    }
  }
  // src/modules/users/users.controller.ts

// Reemplazar el método getVerifiedWorkers con este:

/**
 * 🌐 Listar trabajadores verificados (público)
 */
@Get('workers')
async getVerifiedWorkers(
  @Query('tipo_usuario') tipoUsuario?: string,
  @Query('verificado') verificado?: string,
  @Query('categoria') categoria?: string,
  @Query('departamento') departamento?: string,
  @Query('search') search?: string,
) {
  try {
    const filters = {
      tipoUsuario: tipoUsuario || 'trabajador',
      verificado: verificado !== 'false', // por defecto true
      categoria,
      departamento,
      search,
    };

    console.log('🔍 Filters:', filters);

    const workers = await this.usersService.getVerifiedWorkers(filters);
    
    console.log(`✅ Found ${workers.length} workers`);

    // Remover información sensible
    const workersData = workers.map(worker => {
      const { password, email, dui, ...publicData } = worker as any;
      return publicData;
    });
    
    return {
      status: 'success',
      data: workersData,
      count: workersData.length
    };
  } catch (error) {
    console.error('❌ Error fetching workers:', error);
    throw new BadRequestException('Error obteniendo trabajadores');
  }
}

  /**
   * ✅ Verificar trabajador (admin)
   */
  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async verifyWorker(
    @Param('id') id: string,
    @Body() body: { verified: boolean }
  ) {
    try {
      const updatedUser = await this.usersService.verifyWorker(id, body.verified);
      const { password, ...result } = updatedUser;

      return {
        status: 'success',
        message: `Trabajador ${body.verified ? 'verificado' : 'no verificado'} exitosamente`,
        data: result
      };
    } catch (error) {
      console.error('Error verifying worker:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      const { password, ...result } = user;
      return {
        status: 'success',
        data: result
      };
    } catch (error) {
      throw new BadRequestException('Usuario no encontrado');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async update(@Param('id') id: string, @Body() updateData: any) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await this.usersService.update(id, updateData);
      const { password, ...result } = user;

      return {
        status: 'success',
        message: 'Usuario actualizado exitosamente',
        data: result
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Error actualizando usuario');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('super_admin')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return {
        status: 'success',
        message: 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new BadRequestException('Error eliminando usuario');
    }
  }

  @Post(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'super_admin')
  async suspend(@Param('id') id: string, @Body() body: { reason: string }) {
    try {
      const user = await this.usersService.update(id, { activo: false });
      const { password, ...result } = user;

      return {
        status: 'success',
        message: 'Usuario suspendido exitosamente',
        data: result
      };
    } catch (error) {
      console.error('Error suspending user:', error);
      throw new BadRequestException('Error suspendiendo usuario');
    }
  }
}