"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMissingUserColumns1750000000002 = void 0;
const typeorm_1 = require("typeorm");
class AddMissingUserColumns1750000000002 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('usuarios');
        const columnsToAdd = [
            { name: 'departamento', type: 'varchar', length: '255', isNullable: true },
            { name: 'municipio', type: 'varchar', length: '255', isNullable: true },
            { name: 'direccion', type: 'text', isNullable: true },
            { name: 'biografia', type: 'text', isNullable: true },
            { name: 'tipo_foto_perfil', type: 'varchar', length: '100', isNullable: true },
            { name: 'foto_portada', type: 'varchar', length: '500', isNullable: true },
            { name: 'tipo_foto_portada', type: 'varchar', length: '100', isNullable: true },
        ];
        for (const columnDef of columnsToAdd) {
            const columnExists = table?.findColumnByName(columnDef.name);
            if (!columnExists) {
                await queryRunner.addColumn('usuarios', new typeorm_1.TableColumn(columnDef));
                console.log(`✅ Columna ${columnDef.name} agregada`);
            }
            else {
                console.log(`⚠️ Columna ${columnDef.name} ya existe`);
            }
        }
    }
    async down(queryRunner) {
        const columnsToRemove = [
            'tipo_foto_portada',
            'foto_portada',
            'tipo_foto_perfil',
            'biografia',
            'direccion',
            'municipio',
            'departamento'
        ];
        for (const columnName of columnsToRemove) {
            await queryRunner.dropColumn('usuarios', columnName);
        }
    }
}
exports.AddMissingUserColumns1750000000002 = AddMissingUserColumns1750000000002;
//# sourceMappingURL=1750000000002-AddMissingUserColumns.js.map