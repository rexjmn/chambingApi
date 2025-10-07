"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCoverPhotoToUsers1750000000000 = void 0;
class AddCoverPhotoToUsers1750000000000 {
    async up(queryRunner) {
        console.log('🖼️ Agregando campos de foto de portada a usuarios...');
        await queryRunner.query(`
      ALTER TABLE usuarios 
      ADD COLUMN foto_portada VARCHAR(500) NULL,
      ADD COLUMN tipo_foto_portada VARCHAR(100) NULL
    `);
        console.log('✅ Campos de foto de portada agregados exitosamente');
        console.log('');
        console.log('📋 Campos agregados:');
        console.log('  - foto_portada: URL de la imagen de portada');
        console.log('  - tipo_foto_portada: Tipo MIME de la imagen');
    }
    async down(queryRunner) {
        console.log('🗑️ Eliminando campos de foto de portada...');
        await queryRunner.query(`
      ALTER TABLE usuarios 
      DROP COLUMN IF EXISTS foto_portada,
      DROP COLUMN IF EXISTS tipo_foto_portada
    `);
        console.log('✅ Campos de foto de portada eliminados');
    }
}
exports.AddCoverPhotoToUsers1750000000000 = AddCoverPhotoToUsers1750000000000;
//# sourceMappingURL=1750000000000-AddCoverPhotoToUsers.js.map