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
    this.region = this.configService.get<string>('AWS_REGION') || 'eu-north-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    console.log('🔧 AWS Configuration:');
    console.log('- Region:', this.region);
    console.log('- Bucket:', bucketName);
    console.log('- Access Key:', accessKeyId ? 'SET' : 'MISSING');

    if (!this.region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('AWS credentials are missing');
    }

    this.bucketName = bucketName;
    this.s3Client = new S3Client({
      region: this.region,
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
      if (!this.isValidFileType(contentType)) {
        throw new BadRequestException('Tipo de archivo no permitido');
      }

      const extension = fileExtension || this.getDefaultExtension(contentType);
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
      'image/gif',
      'application/pdf'
    ];
    return allowedTypes.includes(contentType);
  }

  private getDefaultExtension(contentType: string): string {
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'application/pdf': 'pdf'
    };
    return mimeToExt[contentType] || 'bin';
  }

  // ✨ MÉTODO ACTUALIZADO: Ahora acepta folder como parámetro opcional
  async uploadFile(
    file: Express.Multer.File, 
    folder: string = 'profile-photos'
  ): Promise<{ fileUrl: string }> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (!this.isValidFileType(file.mimetype)) {
        throw new BadRequestException('Invalid file type');
      }

      const fileExtension = file.originalname.split('.').pop() || 
                          this.getDefaultExtension(file.mimetype);
      
      // Usar el folder proporcionado o el default
      const fileKey = `${folder}/${uuidv4()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'max-age=31536000',
        Metadata: {
          'uploaded-by': 'chambing-app',
          'upload-date': new Date().toISOString()
        }
      });

      await this.s3Client.send(command);

      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

      console.log('✅ File uploaded successfully:');
      console.log('- Bucket:', this.bucketName);
      console.log('- Region:', this.region);
      console.log('- File Key:', fileKey);
      console.log('- File URL:', fileUrl);

      return { fileUrl };

    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw new BadRequestException(`Error uploading file to S3: ${error.message}`);
    }
  }
}