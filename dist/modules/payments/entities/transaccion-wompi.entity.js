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
exports.TransaccionWompi = void 0;
const typeorm_1 = require("typeorm");
const pago_entity_1 = require("./pago.entity");
let TransaccionWompi = class TransaccionWompi {
    estaAprobada() {
        return this.estadoWompi === 'APPROVED';
    }
    estaDeclinada() {
        return this.estadoWompi === 'DECLINED';
    }
};
exports.TransaccionWompi = TransaccionWompi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pago_id' }),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "pagoId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'wompi_transaction_id',
        length: 255
    }),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "wompiTransactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'wompi_reference',
        length: 255
    }),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "wompiReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estado_wompi',
        length: 50
    }),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "estadoWompi", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], TransaccionWompi.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 3,
        default: 'USD'
    }),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "divisa", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'metodo_pago_wompi',
        length: 50
    }),
    __metadata("design:type", String)
], TransaccionWompi.prototype, "metodoPagoWompi", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', {
        name: 'webhook_data',
        nullable: true
    }),
    __metadata("design:type", Object)
], TransaccionWompi.prototype, "webhookData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion' }),
    __metadata("design:type", Date)
], TransaccionWompi.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'fecha_actualizacion' }),
    __metadata("design:type", Date)
], TransaccionWompi.prototype, "fechaActualizacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pago_entity_1.Pago, pago => pago.transaccionesWompi, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pago_id' }),
    __metadata("design:type", pago_entity_1.Pago)
], TransaccionWompi.prototype, "pago", void 0);
exports.TransaccionWompi = TransaccionWompi = __decorate([
    (0, typeorm_1.Entity)('transacciones_wompi')
], TransaccionWompi);
//# sourceMappingURL=transaccion-wompi.entity.js.map