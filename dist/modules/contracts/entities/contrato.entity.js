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
exports.Contrato = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const categoria_servicio_entity_1 = require("../../services/entities/categoria-servicio.entity");
const estado_contrato_entity_1 = require("./estado-contrato.entity");
let Contrato = class Contrato {
};
exports.Contrato = Contrato;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Contrato.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'empleador_id' }),
    __metadata("design:type", user_entity_1.User)
], Contrato.prototype, "empleador", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'trabajador_id' }),
    __metadata("design:type", user_entity_1.User)
], Contrato.prototype, "trabajador", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_servicio_entity_1.CategoriaServicio),
    (0, typeorm_1.JoinColumn)({ name: 'categoria_id' }),
    __metadata("design:type", categoria_servicio_entity_1.CategoriaServicio)
], Contrato.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Contrato.prototype, "codigo_contrato", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_inicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_fin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pendiente' }),
    __metadata("design:type", String)
], Contrato.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Contrato.prototype, "detalles_servicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Contrato.prototype, "terminos_condiciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Contrato.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contrato.prototype, "codigo_qr_url", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estado_contrato_entity_1.EstadoContrato, estado => estado.contrato),
    __metadata("design:type", Array)
], Contrato.prototype, "estados", void 0);
exports.Contrato = Contrato = __decorate([
    (0, typeorm_1.Entity)('contratos')
], Contrato);
//# sourceMappingURL=contrato.entity.js.map