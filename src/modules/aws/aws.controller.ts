// src/modules/aws/aws.controller.ts
import { 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFile,
    BadRequestException 
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AwsService } from './aws.service';
  import { UsersService } from '../users/users.service';

@Controller('aws')
export class AwsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly awsService: AwsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.awsService.uploadFile(file);
      
      return {
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          fileUrl: result.fileUrl,
          fileName: file.originalname,
          mimeType: file.mimetype
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf'
    };
    return mimeToExt[mimeType] || 'bin';
  }
}