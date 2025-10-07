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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const rol_administrativo_entity_1 = require("../../roles/entities/rol-administrativo.entity");
const skill_entity_1 = require("../../skills/entities/skill.entity");
const tarifa_trabajador_entity_1 = require("../../services/entities/tarifa-trabajador.entity");
let User = class User {
    isWorker() {
        return this.tipo_usuario === 'trabajador';
    }
    isClient() {
        return this.tipo_usuario === 'cliente';
    }
    isVerifiedWorker() {
        return this.isWorker() && this.verificado;
    }
    getAdminRoles() {
        return this.rolesAdministrativos
            ?.filter(ra => ra.activo)
            ?.map(ra => ra.rol.nombre) || [];
    }
    isAdmin() {
        const roles = this.getAdminRoles();
        return roles.includes('admin') || roles.includes('super_admin');
    }
    isSuperAdmin() {
        const roles = this.getAdminRoles();
        return roles.includes('super_admin');
    }
    hasAdminRole(roleName) {
        return this.getAdminRoles().includes(roleName);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], User.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], User.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "municipio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "titulo_profesional", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "biografia", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "dui", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "foto_perfil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "tipo_foto_perfil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'foto_portada', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "foto_portada", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_foto_portada', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "tipo_foto_portada", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'cliente'
    }),
    __metadata("design:type", String)
], User.prototype, "tipo_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'verificado',
        type: 'boolean',
        default: false
    }),
    __metadata("design:type", Boolean)
], User.prototype, "verificado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rol_administrativo_entity_1.RolAdministrativo, rolAdmin => rolAdmin.usuario),
    __metadata("design:type", Array)
], User.prototype, "rolesAdministrativos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tarifa_trabajador_entity_1.TarifaTrabajador, tarifa => tarifa.trabajador),
    __metadata("design:type", Array)
], User.prototype, "tarifas", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, skill => skill.usuarios),
    (0, typeorm_1.JoinTable)({
        name: 'usuario_habilidades',
        joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'habilidad_id', referencedColumnName: 'id' }
    }),
    __metadata("design:type", Array)
], User.prototype, "habilidades", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], User);
//# sourceMappingURL=user.entity.js.map