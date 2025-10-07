"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTarifasTrabajadorAndTitulo1234567890000 = void 0;
const typeorm_1 = require("typeorm");
class AddTarifasTrabajadorAndTitulo1234567890000 {
    async up(queryRunner) {
        await queryRunner.addColumn('usuarios', new typeorm_1.TableColumn({
            name: 'titulo_profesional',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tarifas_trabajador',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'trabajador_id',
                    type: 'uuid',
                },
                {
                    name: 'tarifa_hora',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'tarifa_dia',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'tarifa_semana',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'tarifa_mes',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'moneda',
                    type: 'varchar',
                    length: '3',
                    default: "'USD'",
                },
                {
                    name: 'activo',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'fecha_creacion',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'fecha_actualizacion',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('tarifas_trabajador', new typeorm_1.TableForeignKey({
            columnNames: ['trabajador_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuarios',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('tarifas_trabajador');
        await queryRunner.dropColumn('usuarios', 'titulo_profesional');
    }
}
exports.AddTarifasTrabajadorAndTitulo1234567890000 = AddTarifasTrabajadorAndTitulo1234567890000;
//# sourceMappingURL=AddTarifasTrabajadorAndTitulo1234567890000.js.map