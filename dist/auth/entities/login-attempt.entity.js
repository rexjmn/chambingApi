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
exports.LoginAttempt = void 0;
const typeorm_1 = require("typeorm");
let LoginAttempt = class LoginAttempt {
};
exports.LoginAttempt = LoginAttempt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoginAttempt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LoginAttempt.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'inet' }),
    __metadata("design:type", String)
], LoginAttempt.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'timestamp' }),
    __metadata("design:type", Date)
], LoginAttempt.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], LoginAttempt.prototype, "successful", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', nullable: true }),
    __metadata("design:type", String)
], LoginAttempt.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], LoginAttempt.prototype, "details", void 0);
exports.LoginAttempt = LoginAttempt = __decorate([
    (0, typeorm_1.Entity)('login_attempts')
], LoginAttempt);
//# sourceMappingURL=login-attempt.entity.js.map