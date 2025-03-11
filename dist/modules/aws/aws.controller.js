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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const aws_service_1 = require("./aws.service");
const users_service_1 = require("../users/users.service");
let AwsController = class AwsController {
    constructor(usersService, awsService) {
        this.usersService = usersService;
        this.awsService = awsService;
    }
    async uploadFile(file) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    getExtensionFromMimeType(mimeType) {
        const mimeToExt = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'application/pdf': 'pdf'
        };
        return mimeToExt[mimeType] || 'bin';
    }
};
exports.AwsController = AwsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AwsController.prototype, "uploadFile", null);
exports.AwsController = AwsController = __decorate([
    (0, common_1.Controller)('aws'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        aws_service_1.AwsService])
], AwsController);
//# sourceMappingURL=aws.controller.js.map