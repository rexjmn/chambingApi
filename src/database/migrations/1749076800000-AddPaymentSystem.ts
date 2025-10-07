import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentSystem1749076800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    
    console.log('🚀 Iniciando creación del sistema de pagos...');
    
    // 1. Tabla para gestionar saldos de trabajadores
    await queryRunner.query(`
      CREATE TABLE saldos_trabajador (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        trabajador_id UUID NOT NULL,
        saldo_comisiones_pendientes DECIMAL(10,2) DEFAULT 0,
        saldo_disponible DECIMAL(10,2) DEFAULT 0,
        total_ganado DECIMAL(10,2) DEFAULT 0,
        fecha_ultimo_pago TIMESTAMP NULL,
        estado_cuenta VARCHAR(20) DEFAULT 'activo',
        bloqueado_por_deuda BOOLEAN DEFAULT FALSE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trabajador_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla saldos_trabajador creada');

    // 2. Tabla para historial de pagos
    await queryRunner.query(`
      CREATE TABLE pagos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        contrato_id UUID NOT NULL,
        trabajador_id UUID NOT NULL,
        empleador_id UUID NOT NULL,
        monto_servicio DECIMAL(10,2) NOT NULL,
        comision_plataforma DECIMAL(10,2) NOT NULL,
        monto_trabajador DECIMAL(10,2) NOT NULL,
        metodo_pago VARCHAR(30) NOT NULL,
        estado_pago VARCHAR(30) DEFAULT 'pendiente',
        referencia_externa VARCHAR(255) NULL,
        comision_pagada BOOLEAN DEFAULT FALSE,
        fecha_pago_servicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_pago_comision TIMESTAMP NULL,
        notas TEXT NULL,
        FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
        FOREIGN KEY (trabajador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (empleador_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla pagos creada');

    // 3. Tabla para transacciones Wompi
    await queryRunner.query(`
      CREATE TABLE transacciones_wompi (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        pago_id UUID NOT NULL,
        wompi_transaction_id VARCHAR(255) NOT NULL,
        wompi_reference VARCHAR(255) NOT NULL,
        estado_wompi VARCHAR(50) NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        divisa VARCHAR(3) DEFAULT 'USD',
        metodo_pago_wompi VARCHAR(50) NOT NULL,
        webhook_data JSONB NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pago_id) REFERENCES pagos(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla transacciones_wompi creada');

    // 4. Tabla para notificaciones de pago
    await queryRunner.query(`
      CREATE TABLE notificaciones_pago (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        usuario_id UUID NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        leida BOOLEAN DEFAULT FALSE,
        enviada_email BOOLEAN DEFAULT FALSE,
        datos_adicionales JSONB NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla notificaciones_pago creada');

    // 5. Agregar campos a tabla contratos existente
    await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN metodo_pago_acordado VARCHAR(30) DEFAULT 'efectivo',
      ADD COLUMN porcentaje_comision DECIMAL(5,2) DEFAULT 10.00,
      ADD COLUMN pago_procesado BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Campos agregados a tabla contratos');

    // 6. Crear índices para optimizar consultas
    await queryRunner.query(`
      CREATE INDEX idx_saldos_trabajador_id ON saldos_trabajador(trabajador_id);
      CREATE INDEX idx_pagos_trabajador ON pagos(trabajador_id);
      CREATE INDEX idx_pagos_estado ON pagos(estado_pago);
      CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago_servicio);
      CREATE INDEX idx_transacciones_wompi_ref ON transacciones_wompi(wompi_reference);
      CREATE INDEX idx_notificaciones_usuario ON notificaciones_pago(usuario_id, leida);
    `);
    console.log('✅ Índices creados');

    console.log('🎉 ¡Sistema de pagos instalado exitosamente!');
    console.log('');
    console.log('📋 Tablas creadas:');
    console.log('  - saldos_trabajador');
    console.log('  - pagos');
    console.log('  - transacciones_wompi');
    console.log('  - notificaciones_pago');
    console.log('');
    console.log('🔧 Campos agregados a contratos:');
    console.log('  - metodo_pago_acordado');
    console.log('  - porcentaje_comision');
    console.log('  - pago_procesado');
    console.log('');
    console.log('🚀 Próximo paso: Copiar archivos del sistema de pagos');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🗑️ Eliminando sistema de pagos...');
    
    // Eliminar en orden inverso para respetar foreign keys
    await queryRunner.query(`DROP TABLE IF EXISTS notificaciones_pago CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS transacciones_wompi CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS pagos CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS saldos_trabajador CASCADE`);
    
    // Remover campos agregados
    await queryRunner.query(`
      ALTER TABLE contratos 
      DROP COLUMN IF EXISTS metodo_pago_acordado,
      DROP COLUMN IF EXISTS porcentaje_comision,
      DROP COLUMN IF EXISTS pago_procesado
    `);

    console.log('✅ Sistema de pagos eliminado completamente');
  }
}