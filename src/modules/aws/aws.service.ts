// src/modules/aws/aws.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    // Obtener y validar configuraciones
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    // Validar que todas las configuraciones existan
    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('AWS credentials are missing');
    }

    this.bucketName = bucketName;
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      }
    });
  }

  async generateUploadUrl(
    folder: string,
    fileExtension: string | undefined,
    contentType: string
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    try {
      // Validar tipo de archivo
      if (!this.isValidFileType(contentType)) {
        throw new BadRequestException('Tipo de archivo no permitido');
      }

      // Asegurar que tenemos una extensión válida
      const extension = fileExtension || this.getDefaultExtension(contentType);

      // Generar nombre único para el archivo
      const fileKey = `${folder}/${uuidv4()}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { 
        expiresIn: 3600 
      });

      return { uploadUrl, fileKey };

    } catch (error) {
      console.error('Error generando URL de subida:', error);
      throw new Error('Error generando URL para subida de archivo');
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey
      });

      await this.s3Client.send(command);
      console.log(`File ${fileKey} deleted successfully from S3`);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new BadRequestException('Error deleting file from S3');
    }
  }


  private isValidFileType(contentType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];
    return allowedTypes.includes(contentType);
  }

  private getDefaultExtension(contentType: string): string {
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf'
    };
    return mimeToExt[contentType] || 'bin';
  }

  async uploadFile(file: Express.Multer.File): Promise<{ fileUrl: string }> {
    try {
      // Validar el archivo
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      // Validar tipo de archivo
      if (!this.isValidFileType(file.mimetype)) {
        throw new BadRequestException('Invalid file type');
      }

      const fileExtension = file.originalname.split('.').pop() || 
                          this.getDefaultExtension(file.mimetype);
      
      const fileKey = `test-uploads/${uuidv4()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype
      });

      await this.s3Client.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

      return { fileUrl };

    } catch (error) {
      console.error('Error uploading file:', error);
      throw new BadRequestException('Error uploading file to S3');
    }
  }
}