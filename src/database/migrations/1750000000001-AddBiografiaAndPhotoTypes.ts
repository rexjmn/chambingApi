import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBiografiaAndPhotoTypes1750000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna biografia ya existe
    const table = await queryRunner.getTable('usuarios');
    const biografiaExists = table?.findColumnByName('biografia');
    
    if (!biografiaExists) {
      await queryRunner.addColumn('usuarios', new TableColumn({
        name: 'biografia',
        type: 'text',
        isNullable: true,
      }));
      console.log('✅ Columna biografia agregada');
    } else {
      console.log('⚠️ Columna biografia ya existe, saltando...');
    }

    // Verificar y agregar tipo_foto_perfil
    const tipoFotoPerfilExists = table?.findColumnByName('tipo_foto_perfil');
    if (!tipoFotoPerfilExists) {
      await queryRunner.addColumn('usuarios', new TableColumn({
        name: 'tipo_foto_perfil',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }));
      console.log('✅ Columna tipo_foto_perfil agregada');
    } else {
      console.log('⚠️ Columna tipo_foto_perfil ya existe, saltando...');
    }

    // Verificar y agregar foto_portada (si no existe)
    const fotoPortadaExists = table?.findColumnByName('foto_portada');
    if (!fotoPortadaExists) {
      await queryRunner.addColumn('usuarios', new TableColumn({
        name: 'foto_portada',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }));
      console.log('✅ Columna foto_portada agregada');
    } else {
      console.log('⚠️ Columna foto_portada ya existe, saltando...');
    }

    // Verificar y agregar tipo_foto_portada
    const tipoFotoPortadaExists = table?.findColumnByName('tipo_foto_portada');
    if (!tipoFotoPortadaExists) {
      await queryRunner.addColumn('usuarios', new TableColumn({
        name: 'tipo_foto_portada',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }));
      console.log('✅ Columna tipo_foto_portada agregada');
    } else {
      console.log('⚠️ Columna tipo_foto_portada ya existe, saltando...');
    }

    console.log('✅ Migración completada exitosamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columnas en orden inverso
    await queryRunner.dropColumn('usuarios', 'tipo_foto_portada');
    await queryRunner.dropColumn('usuarios', 'foto_portada');
    await queryRunner.dropColumn('usuarios', 'tipo_foto_perfil');
    await queryRunner.dropColumn('usuarios', 'biografia');
    
    console.log('✅ Rollback completado');
  }
}