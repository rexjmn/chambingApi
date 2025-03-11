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
exports.EstadoContrato = void 0;
const typeorm_1 = require("typeorm");
const contrato_entity_1 = require("./contrato.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let EstadoContrato = class EstadoContrato {
};
exports.EstadoContrato = EstadoContrato;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EstadoContrato.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contrato_entity_1.Contrato, contrato => contrato.estados),
    (0, typeorm_1.JoinColumn)({ name: 'contrato_id' }),
    __metadata("design:type", contrato_entity_1.Contrato)
], EstadoContrato.prototype, "contrato", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EstadoContrato.prototype, "estado_anterior", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EstadoContrato.prototype, "estado_nuevo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EstadoContrato.prototype, "fecha_cambio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], EstadoContrato.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EstadoContrato.prototype, "notas", void 0);
exports.EstadoContrato = EstadoContrato = __decorate([
    (0, typeorm_1.Entity)('estados_contrato')
], EstadoContrato);
//# sourceMappingURL=estado-contrato.entity.js.map