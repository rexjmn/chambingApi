"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const payments_controller_1 = require("./payments.controller");
const payments_service_1 = require("./payments.service");
const wompi_service_1 = require("./services/wompi.service");
const pago_entity_1 = require("./entities/pago.entity");
const saldo_trabajador_entity_1 = require("./entities/saldo-trabajador.entity");
const transaccion_wompi_entity_1 = require("./entities/transaccion-wompi.entity");
const notificacion_pago_entity_1 = require("./entities/notificacion-pago.entity");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                pago_entity_1.Pago,
                saldo_trabajador_entity_1.SaldoTrabajador,
                transaccion_wompi_entity_1.TransaccionWompi,
                notificacion_pago_entity_1.NotificacionPago,
            ]),
            config_1.ConfigModule,
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, wompi_service_1.WompiService],
        exports: [payments_service_1.PaymentsService, wompi_service_1.WompiService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map