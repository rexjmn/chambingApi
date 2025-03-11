"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
let AwsService = class AwsService {
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const bucketName = this.configService.get('AWS_BUCKET_NAME');
        if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
            throw new Error('AWS credentials are missing');
        }
        this.bucketName = bucketName;
        this.s3Client = new client_s3_1.S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            }
        });
    }
    async generateUploadUrl(folder, fileExtension, contentType) {
        try {
            if (!this.isValidFileType(contentType)) {
                throw new common_1.BadRequestException('Tipo de archivo no permitido');
            }
            const extension = fileExtension || this.getDefaultExtension(contentType);
            const fileKey = `${folder}/${(0, uuid_1.v4)()}.${extension}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
                ContentType: contentType,
            });
            const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
                expiresIn: 3600
            });
            return { uploadUrl, fileKey };
        }
        catch (error) {
            console.error('Error generando URL de subida:', error);
            throw new Error('Error generando URL para subida de archivo');
        }
    }
    async deleteFile(fileKey) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey
            });
            await this.s3Client.send(command);
            console.log(`File ${fileKey} deleted successfully from S3`);
        }
        catch (error) {
            console.error('Error deleting file from S3:', error);
            throw new common_1.BadRequestException('Error deleting file from S3');
        }
    }
    isValidFileType(contentType) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ];
        return allowedTypes.includes(contentType);
    }
    getDefaultExtension(contentType) {
        const mimeToExt = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'application/pdf': 'pdf'
        };
        return mimeToExt[contentType] || 'bin';
    }
    async uploadFile(file) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('No file provided');
            }
            if (!this.isValidFileType(file.mimetype)) {
                throw new common_1.BadRequestException('Invalid file type');
            }
            const fileExtension = file.originalname.split('.').pop() ||
                this.getDefaultExtension(file.mimetype);
            const fileKey = `test-uploads/${(0, uuid_1.v4)()}.${fileExtension}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype
            });
            await this.s3Client.send(command);
            const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;
            return { fileUrl };
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new common_1.BadRequestException('Error uploading file to S3');
        }
    }
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsService);
//# sourceMappingURL=aws.service.js.map