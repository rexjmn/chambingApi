import { AwsService } from './aws.service';
import { UsersService } from '../users/users.service';
export declare class AwsController {
    private readonly usersService;
    private readonly awsService;
    constructor(usersService: UsersService, awsService: AwsService);
    uploadFile(file: Express.Multer.File): Promise<{
        status: string;
        message: string;
        data: {
            fileUrl: string;
            fileName: string;
            mimeType: string;
        };
    }>;
    private getExtensionFromMimeType;
}
