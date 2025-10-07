import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMissingUserColumns1750000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.addColumn('usuarios', new TableColumn(columnDef));
        console.log(`✅ Columna ${columnDef.name} agregada`);
      } else {
        console.log(`⚠️ Columna ${columnDef.name} ya existe`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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