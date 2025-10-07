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
    puedeSerActivado() {
        return this.estado === 'pendiente_activacion';
    }
    puedeSerCompletado() {
        return this.estado === 'activo';
    }
    puedeSerCancelado() {
        return ['pendiente_activacion', 'activo'].includes(this.estado);
    }
    calcularMontoTrabajador() {
        const comisionMonto = this.monto_total * (this.comision_plataforma / 100);
        return this.monto_total - comisionMonto;
    }
    estaVencido() {
        return new Date() > new Date(this.fecha_inicio_programada) &&
            this.estado === 'pendiente_activacion';
    }
};
exports.Contrato = Contrato;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Contrato.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'empleador_id' }),
    __metadata("design:type", user_entity_1.User)
], Contrato.prototype, "empleador", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'trabajador_id' }),
    __metadata("design:type", user_entity_1.User)
], Contrato.prototype, "trabajador", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_servicio_entity_1.CategoriaServicio, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoria_id' }),
    __metadata("design:type", categoria_servicio_entity_1.CategoriaServicio)
], Contrato.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], Contrato.prototype, "codigo_contrato", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 6 }),
    __metadata("design:type", String)
], Contrato.prototype, "pin_activacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Contrato.prototype, "codigo_qr_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_creacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_inicio_programada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_fin_programada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_activacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_completado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_cierre", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contrato.prototype, "fecha_actualizacion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 30,
        default: 'pendiente_activacion'
    }),
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
], Contrato.prototype, "monto_total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pendiente'
    }),
    __metadata("design:type", String)
], Contrato.prototype, "estado_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'efectivo'
    }),
    __metadata("design:type", String)
], Contrato.prototype, "metodo_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Contrato.prototype, "stripe_payment_intent_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 10 }),
    __metadata("design:type", Number)
], Contrato.prototype, "comision_plataforma", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Contrato.prototype, "monto_trabajador", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Contrato.prototype, "activado_por", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Contrato.prototype, "metodo_activacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Contrato.prototype, "ip_activacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estado_contrato_entity_1.EstadoContrato, estado => estado.contrato, {
        cascade: true
    }),
    __metadata("design:type", Array)
], Contrato.prototype, "estados", void 0);
exports.Contrato = Contrato = __decorate([
    (0, typeorm_1.Entity)('contratos')
], Contrato);
//# sourceMappingURL=contrato.entity.js.map