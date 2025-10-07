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
exports.Pago = exports.EstadoPago = exports.MetodoPago = void 0;
const typeorm_1 = require("typeorm");
const transaccion_wompi_entity_1 = require("./transaccion-wompi.entity");
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["EFECTIVO"] = "efectivo";
    MetodoPago["WOMPI_TARJETA"] = "wompi_tarjeta";
    MetodoPago["WOMPI_BITCOIN"] = "wompi_bitcoin";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
var EstadoPago;
(function (EstadoPago) {
    EstadoPago["PENDIENTE"] = "pendiente";
    EstadoPago["COMPLETADO"] = "completado";
    EstadoPago["FALLIDO"] = "fallido";
    EstadoPago["REEMBOLSADO"] = "reembolsado";
})(EstadoPago || (exports.EstadoPago = EstadoPago = {}));
let Pago = class Pago {
    calcularComision(porcentaje = 10) {
        this.comisionPlataforma = this.montoServicio * (porcentaje / 100);
        this.montoTrabajador = this.montoServicio - this.comisionPlataforma;
    }
    esMetodoElectronico() {
        return this.metodoPago !== MetodoPago.EFECTIVO;
    }
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pago.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contrato_id' }),
    __metadata("design:type", String)
], Pago.prototype, "contratoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trabajador_id' }),
    __metadata("design:type", String)
], Pago.prototype, "trabajadorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'empleador_id' }),
    __metadata("design:type", String)
], Pago.prototype, "empleadorId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'monto_servicio',
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], Pago.prototype, "montoServicio", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'comision_plataforma',
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], Pago.prototype, "comisionPlataforma", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'monto_trabajador',
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], Pago.prototype, "montoTrabajador", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'metodo_pago',
        type: 'varchar',
        length: 30,
        enum: MetodoPago,
    }),
    __metadata("design:type", String)
], Pago.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estado_pago',
        type: 'varchar',
        length: 30,
        enum: EstadoPago,
        default: EstadoPago.PENDIENTE,
    }),
    __metadata("design:type", String)
], Pago.prototype, "estadoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'referencia_externa',
        length: 255,
        nullable: true
    }),
    __metadata("design:type", String)
], Pago.prototype, "referenciaExterna", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'comision_pagada',
        default: false
    }),
    __metadata("design:type", Boolean)
], Pago.prototype, "comisionPagada", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_pago_servicio' }),
    __metadata("design:type", Date)
], Pago.prototype, "fechaPagoServicio", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fecha_pago_comision',
        type: 'timestamp',
        nullable: true
    }),
    __metadata("design:type", Date)
], Pago.prototype, "fechaPagoComision", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaccion_wompi_entity_1.TransaccionWompi, transaccion => transaccion.pago),
    __metadata("design:type", Array)
], Pago.prototype, "transaccionesWompi", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)('pagos')
], Pago);
//# sourceMappingURL=pago.entity.js.map