import { ConfigService } from '@nestjs/config';
export declare class AwsService {
    private configService;
    private s3Client;
    private readonly bucketName;
    private readonly region;
    constructor(configService: ConfigService);
    generateUploadUrl(folder: string, fileExtension: string | undefined, contentType: string): Promise<{
        uploadUrl: string;
        fileKey: string;
    }>;
    deleteFile(fileKey: string): Promise<void>;
    private isValidFileType;
    private getDefaultExtension;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        fileUrl: string;
    }>;
}
