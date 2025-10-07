import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddTarifasTrabajadorAndTitulo1234567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar campo titulo_profesional a usuarios
    await queryRunner.addColumn('usuarios', new TableColumn({
      name: 'titulo_profesional',
      type: 'varchar',
      length: '100',
      isNullable: true,
    }));

    // 2. Crear tabla de tarifas_trabajador
    await queryRunner.createTable(new Table({
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

    // 3. Agregar foreign key
    await queryRunner.createForeignKey('tarifas_trabajador', new TableForeignKey({
      columnNames: ['trabajador_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'usuarios',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tarifas_trabajador');
    await queryRunner.dropColumn('usuarios', 'titulo_profesional');
  }
}