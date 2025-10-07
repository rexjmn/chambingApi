import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverPhotoToUsers1750000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🗑️ Eliminando campos de foto de portada...');
    
    await queryRunner.query(`
      ALTER TABLE usuarios 
      DROP COLUMN IF EXISTS foto_portada,
      DROP COLUMN IF EXISTS tipo_foto_portada
    `);

    console.log('✅ Campos de foto de portada eliminados');
  }
}