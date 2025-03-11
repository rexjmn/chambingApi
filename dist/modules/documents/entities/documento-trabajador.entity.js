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
exports.DocumentoTrabajador = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let DocumentoTrabajador = class DocumentoTrabajador {
};
exports.DocumentoTrabajador = DocumentoTrabajador;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DocumentoTrabajador.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], DocumentoTrabajador.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_documento' }),
    __metadata("design:type", String)
], DocumentoTrabajador.prototype, "tipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_documento' }),
    __metadata("design:type", String)
], DocumentoTrabajador.prototype, "urlDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DocumentoTrabajador.prototype, "fecha_carga", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], DocumentoTrabajador.prototype, "fecha_vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estado_verificacion', default: 'pendiente' }),
    __metadata("design:type", String)
], DocumentoTrabajador.prototype, "estadoVerificacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'verificador_id' }),
    __metadata("design:type", user_entity_1.User)
], DocumentoTrabajador.prototype, "verificador", void 0);
exports.DocumentoTrabajador = DocumentoTrabajador = __decorate([
    (0, typeorm_1.Entity)('documentos_trabajador')
], DocumentoTrabajador);
//# sourceMappingURL=documento-trabajador.entity.js.map