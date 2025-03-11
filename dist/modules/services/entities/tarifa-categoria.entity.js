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
exports.TarifaCategoria = void 0;
const typeorm_1 = require("typeorm");
const categoria_servicio_entity_1 = require("./categoria-servicio.entity");
let TarifaCategoria = class TarifaCategoria {
};
exports.TarifaCategoria = TarifaCategoria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TarifaCategoria.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_servicio_entity_1.CategoriaServicio),
    (0, typeorm_1.JoinColumn)({ name: 'categoria_id' }),
    __metadata("design:type", categoria_servicio_entity_1.CategoriaServicio)
], TarifaCategoria.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_tarifa' }),
    __metadata("design:type", String)
], TarifaCategoria.prototype, "tipoTarifa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TarifaCategoria.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TarifaCategoria.prototype, "unidad", void 0);
exports.TarifaCategoria = TarifaCategoria = __decorate([
    (0, typeorm_1.Entity)('tarifas_categoria')
], TarifaCategoria);
//# sourceMappingURL=tarifa-categoria.entity.js.map