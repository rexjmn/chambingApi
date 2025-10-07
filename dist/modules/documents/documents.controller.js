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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const documents_service_1 = require("./documents.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const create_documento_dto_1 = require("./dto/create-documento.dto");
const update_documento_dto_1 = require("./dto/update-documento.dto");
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    async uploadDocument(file, createDocumentoDto) {
        const urlDocumento = await this.uploadToStorage(file);
        return this.documentsService.create({
            ...createDocumentoDto,
            urlDocumento
        });
    }
    findAll(usuarioId, tipoDocumento, estadoVerificacion) {
        return this.documentsService.findAll({
            usuarioId,
            tipoDocumento,
            estadoVerificacion
        });
    }
    findOne(id) {
        return this.documentsService.findOne(id);
    }
    verifyDocument(id, verificationData) {
        return this.documentsService.verifyDocument(id, verificationData.verificadorId, verificationData.resultado, verificationData.notas);
    }
    async update(id, updateDocumentoDto) {
        return this.documentsService.update(id, updateDocumentoDto);
    }
    async uploadToStorage(file) {
        throw new Error('Método no implementado');
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('documento')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_documento_dto_1.CreateDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin', 'verificador'),
    __param(0, (0, common_1.Query)('usuarioId')),
    __param(1, (0, common_1.Query)('tipoDocumento')),
    __param(2, (0, common_1.Query)('estadoVerificacion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin', 'verificador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, roles_decorator_1.RequireRoles)('admin', 'super_admin', 'verificador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "verifyDocument", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_documento_dto_1.UpdateDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "update", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map