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
exports.RolAdministrativo = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const role_entity_1 = require("./role.entity");
let RolAdministrativo = class RolAdministrativo {
};
exports.RolAdministrativo = RolAdministrativo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RolAdministrativo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], RolAdministrativo.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'rol_id' }),
    __metadata("design:type", role_entity_1.Role)
], RolAdministrativo.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'asignado_por' }),
    __metadata("design:type", user_entity_1.User)
], RolAdministrativo.prototype, "asignadoPor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RolAdministrativo.prototype, "fecha_asignacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RolAdministrativo.prototype, "activo", void 0);
exports.RolAdministrativo = RolAdministrativo = __decorate([
    (0, typeorm_1.Entity)('roles_administrativos')
], RolAdministrativo);
//# sourceMappingURL=rol-administrativo.entity.js.map