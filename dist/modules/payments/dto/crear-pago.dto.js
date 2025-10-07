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
exports.ProcesarPagoEfectivoDto = exports.CrearPagoDto = void 0;
const class_validator_1 = require("class-validator");
const pago_entity_1 = require("../entities/pago.entity");
class CrearPagoDto {
}
exports.CrearPagoDto = CrearPagoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPagoDto.prototype, "contratoId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPagoDto.prototype, "trabajadorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPagoDto.prototype, "empleadorId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CrearPagoDto.prototype, "montoServicio", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(pago_entity_1.MetodoPago),
    __metadata("design:type", String)
], CrearPagoDto.prototype, "metodoPago", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CrearPagoDto.prototype, "porcentajeComision", void 0);
class ProcesarPagoEfectivoDto {
}
exports.ProcesarPagoEfectivoDto = ProcesarPagoEfectivoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcesarPagoEfectivoDto.prototype, "notas", void 0);
//# sourceMappingURL=crear-pago.dto.js.map