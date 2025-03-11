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
exports.TrabajadorCategoria = void 0;
const typeorm_1 = require("typeorm");
const categoria_servicio_entity_1 = require("./categoria-servicio.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let TrabajadorCategoria = class TrabajadorCategoria {
};
exports.TrabajadorCategoria = TrabajadorCategoria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TrabajadorCategoria.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], TrabajadorCategoria.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_servicio_entity_1.CategoriaServicio, categoria => categoria.trabajadoresCategorias),
    (0, typeorm_1.JoinColumn)({ name: 'categoria_id' }),
    __metadata("design:type", categoria_servicio_entity_1.CategoriaServicio)
], TrabajadorCategoria.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TrabajadorCategoria.prototype, "verificado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TrabajadorCategoria.prototype, "fecha_verificacion", void 0);
exports.TrabajadorCategoria = TrabajadorCategoria = __decorate([
    (0, typeorm_1.Entity)('trabajador_categorias')
], TrabajadorCategoria);
//# sourceMappingURL=trabajador-categoria.entity.js.map