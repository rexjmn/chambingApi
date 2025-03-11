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
exports.CategoriaServicio = void 0;
const typeorm_1 = require("typeorm");
const trabajador_categoria_entity_1 = require("./trabajador-categoria.entity");
const tarifa_categoria_entity_1 = require("./tarifa-categoria.entity");
let CategoriaServicio = class CategoriaServicio {
};
exports.CategoriaServicio = CategoriaServicio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CategoriaServicio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CategoriaServicio.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CategoriaServicio.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'requisitos_documentos' }),
    __metadata("design:type", Object)
], CategoriaServicio.prototype, "requisitosDocumentos", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CategoriaServicio.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => trabajador_categoria_entity_1.TrabajadorCategoria, trabajadorCat => trabajadorCat.categoria),
    __metadata("design:type", Array)
], CategoriaServicio.prototype, "trabajadoresCategorias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tarifa_categoria_entity_1.TarifaCategoria, tarifa => tarifa.categoria),
    __metadata("design:type", Array)
], CategoriaServicio.prototype, "tarifas", void 0);
exports.CategoriaServicio = CategoriaServicio = __decorate([
    (0, typeorm_1.Entity)('categorias_servicio')
], CategoriaServicio);
//# sourceMappingURL=categoria-servicio.entity.js.map