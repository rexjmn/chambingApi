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
exports.SaldoTrabajador = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let SaldoTrabajador = class SaldoTrabajador {
    puedeTrabajar() {
        return !this.bloqueadoPorDeuda && this.estadoCuenta === 'activo';
    }
    actualizarDeuda(monto) {
        this.saldoComisionesPendientes += monto;
        this.bloqueadoPorDeuda = this.saldoComisionesPendientes > 50;
    }
};
exports.SaldoTrabajador = SaldoTrabajador;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SaldoTrabajador.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trabajador_id' }),
    __metadata("design:type", String)
], SaldoTrabajador.prototype, "trabajadorId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'saldo_comisiones_pendientes',
        precision: 10,
        scale: 2,
        default: 0
    }),
    __metadata("design:type", Number)
], SaldoTrabajador.prototype, "saldoComisionesPendientes", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'saldo_disponible',
        precision: 10,
        scale: 2,
        default: 0
    }),
    __metadata("design:type", Number)
], SaldoTrabajador.prototype, "saldoDisponible", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', {
        name: 'total_ganado',
        precision: 10,
        scale: 2,
        default: 0
    }),
    __metadata("design:type", Number)
], SaldoTrabajador.prototype, "totalGanado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_ultimo_pago', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SaldoTrabajador.prototype, "fechaUltimoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estado_cuenta',
        length: 20,
        default: 'activo'
    }),
    __metadata("design:type", String)
], SaldoTrabajador.prototype, "estadoCuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bloqueado_por_deuda',
        default: false
    }),
    __metadata("design:type", Boolean)
], SaldoTrabajador.prototype, "bloqueadoPorDeuda", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion' }),
    __metadata("design:type", Date)
], SaldoTrabajador.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'fecha_actualizacion' }),
    __metadata("design:type", Date)
], SaldoTrabajador.prototype, "fechaActualizacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'trabajador_id' }),
    __metadata("design:type", user_entity_1.User)
], SaldoTrabajador.prototype, "trabajador", void 0);
exports.SaldoTrabajador = SaldoTrabajador = __decorate([
    (0, typeorm_1.Entity)('saldos_trabajador')
], SaldoTrabajador);
//# sourceMappingURL=saldo-trabajador.entity.js.map