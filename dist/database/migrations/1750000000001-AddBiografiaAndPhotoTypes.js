"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBiografiaAndPhotoTypes1750000000001 = void 0;
const typeorm_1 = require("typeorm");
class AddBiografiaAndPhotoTypes1750000000001 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('usuarios');
        const biografiaExists = table?.findColumnByName('biografia');
        if (!biografiaExists) {
            await queryRunner.addColumn('usuarios', new typeorm_1.TableColumn({
                name: 'biografia',
                type: 'text',
                isNullable: true,
            }));
            console.log('✅ Columna biografia agregada');
        }
        else {
            console.log('⚠️ Columna biografia ya existe, saltando...');
        }
        const tipoFotoPerfilExists = table?.findColumnByName('tipo_foto_perfil');
        if (!tipoFotoPerfilExists) {
            await queryRunner.addColumn('usuarios', new typeorm_1.TableColumn({
                name: 'tipo_foto_perfil',
                type: 'varchar',
                length: '100',
                isNullable: true,
            }));
            console.log('✅ Columna tipo_foto_perfil agregada');
        }
        else {
            console.log('⚠️ Columna tipo_foto_perfil ya existe, saltando...');
        }
        const fotoPortadaExists = table?.findColumnByName('foto_portada');
        if (!fotoPortadaExists) {
            await queryRunner.addColumn('usuarios', new typeorm_1.TableColumn({
                name: 'foto_portada',
                type: 'varchar',
                length: '500',
                isNullable: true,
            }));
            console.log('✅ Columna foto_portada agregada');
        }
        else {
            console.log('⚠️ Columna foto_portada ya existe, saltando...');
        }
        const tipoFotoPortadaExists = table?.findColumnByName('tipo_foto_portada');
        if (!tipoFotoPortadaExists) {
            await queryRunner.addColumn('usuarios', new typeorm_1.TableColumn({
                name: 'tipo_foto_portada',
                type: 'varchar',
                length: '100',
                isNullable: true,
            }));
            console.log('✅ Columna tipo_foto_portada agregada');
        }
        else {
            console.log('⚠️ Columna tipo_foto_portada ya existe, saltando...');
        }
        console.log('✅ Migración completada exitosamente');
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('usuarios', 'tipo_foto_portada');
        await queryRunner.dropColumn('usuarios', 'foto_portada');
        await queryRunner.dropColumn('usuarios', 'tipo_foto_perfil');
        await queryRunner.dropColumn('usuarios', 'biografia');
        console.log('✅ Rollback completado');
    }
}
exports.AddBiografiaAndPhotoTypes1750000000001 = AddBiografiaAndPhotoTypes1750000000001;
//# sourceMappingURL=1750000000001-AddBiografiaAndPhotoTypes.js.map