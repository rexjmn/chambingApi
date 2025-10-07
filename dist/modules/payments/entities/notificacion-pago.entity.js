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
exports.NotificacionPago = exports.TipoNotificacion = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var TipoNotificacion;
(function (TipoNotificacion) {
    TipoNotificacion["COMISION_PENDIENTE"] = "comision_pendiente";
    TipoNotificacion["PAGO_RECIBIDO"] = "pago_recibido";
    TipoNotificacion["CUENTA_BLOQUEADA"] = "cuenta_bloqueada";
    TipoNotificacion["PAGO_FALLIDO"] = "pago_fallido";
    TipoNotificacion["RECORDATORIO_DEUDA"] = "recordatorio_deuda";
})(TipoNotificacion || (exports.TipoNotificacion = TipoNotificacion = {}));
let NotificacionPago = class NotificacionPago {
    marcarComoLeida() {
        this.leida = true;
    }
    marcarEmailEnviado() {
        this.enviadaEmail = true;
    }
};
exports.NotificacionPago = NotificacionPago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotificacionPago.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_id' }),
    __metadata("design:type", String)
], NotificacionPago.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        enum: TipoNotificacion,
    }),
    __metadata("design:type", String)
], NotificacionPago.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], NotificacionPago.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], NotificacionPago.prototype, "mensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], NotificacionPago.prototype, "leida", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'enviada_email',
        default: false
    }),
    __metadata("design:type", Boolean)
], NotificacionPago.prototype, "enviadaEmail", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', {
        name: 'datos_adicionales',
        nullable: true
    }),
    __metadata("design:type", Object)
], NotificacionPago.prototype, "datosAdicionales", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_creacion' }),
    __metadata("design:type", Date)
], NotificacionPago.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], NotificacionPago.prototype, "usuario", void 0);
exports.NotificacionPago = NotificacionPago = __decorate([
    (0, typeorm_1.Entity)('notificaciones_pago')
], NotificacionPago);
//# sourceMappingURL=notificacion-pago.entity.js.map