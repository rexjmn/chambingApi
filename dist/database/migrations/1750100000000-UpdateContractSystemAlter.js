"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContractSystemAlter1750100000000 = void 0;
class UpdateContractSystemAlter1750100000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS pin_activacion VARCHAR(6) DEFAULT '000000'
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      RENAME COLUMN fecha_inicio TO fecha_inicio_programada
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      RENAME COLUMN fecha_fin TO fecha_fin_programada
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      RENAME COLUMN monto TO monto_total
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS fecha_activacion TIMESTAMP NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS fecha_completado TIMESTAMP NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS fecha_cierre TIMESTAMP NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS estado_pago VARCHAR(20) DEFAULT 'pendiente'
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      RENAME COLUMN metodo_pago_acordado TO metodo_pago
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ALTER COLUMN metodo_pago SET DEFAULT 'efectivo'
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(100) NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      RENAME COLUMN porcentaje_comision TO comision_plataforma
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ALTER COLUMN comision_plataforma TYPE DECIMAL(5,2)
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS monto_trabajador DECIMAL(10,2) DEFAULT 0
    `);
        await queryRunner.query(`
      UPDATE contratos 
      SET monto_trabajador = monto_total - (monto_total * (comision_plataforma / 100))
      WHERE monto_trabajador = 0
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS activado_por VARCHAR(20) NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS metodo_activacion VARCHAR(20) NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ADD COLUMN IF NOT EXISTS ip_activacion VARCHAR(50) NULL
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      DROP COLUMN IF EXISTS pago_procesado
    `);
        await queryRunner.query(`
      ALTER TABLE contratos 
      ALTER COLUMN estado TYPE VARCHAR(30)
    `);
        await queryRunner.query(`
      UPDATE contratos 
      SET estado = 'pendiente_activacion' 
      WHERE estado = 'pendiente'
    `);
        await queryRunner.query(`
      ALTER TABLE estados_contrato 
      ALTER COLUMN estado_anterior DROP NOT NULL
    `);
        await queryRunner.query(`
      ALTER TABLE estados_contrato 
      ALTER COLUMN estado_anterior TYPE VARCHAR(30)
    `);
        await queryRunner.query(`
      ALTER TABLE estados_contrato 
      ALTER COLUMN estado_nuevo TYPE VARCHAR(30)
    `);
        await queryRunner.query(`
      ALTER TABLE estados_contrato 
      ALTER COLUMN notas DROP NOT NULL
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contratos_empleador ON contratos(empleador_id)
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contratos_trabajador ON contratos(trabajador_id)
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos(estado)
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contratos_fecha_creacion ON contratos(fecha_creacion DESC)
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_estados_contrato_id ON estados_contrato(contrato_id)
    `);
        await queryRunner.query(`
      UPDATE contratos 
      SET pin_activacion = LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')
      WHERE pin_activacion = '000000'
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_contratos_empleador`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_contratos_trabajador`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_contratos_estado`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_contratos_fecha_creacion`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_estados_contrato_id`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS pin_activacion`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS fecha_activacion`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS fecha_completado`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS fecha_cierre`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS fecha_actualizacion`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS estado_pago`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS stripe_payment_intent_id`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS monto_trabajador`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS activado_por`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS metodo_activacion`);
        await queryRunner.query(`ALTER TABLE contratos DROP COLUMN IF EXISTS ip_activacion`);
        await queryRunner.query(`ALTER TABLE contratos RENAME COLUMN fecha_inicio_programada TO fecha_inicio`);
        await queryRunner.query(`ALTER TABLE contratos RENAME COLUMN fecha_fin_programada TO fecha_fin`);
        await queryRunner.query(`ALTER TABLE contratos RENAME COLUMN monto_total TO monto`);
        await queryRunner.query(`ALTER TABLE contratos RENAME COLUMN metodo_pago TO metodo_pago_acordado`);
        await queryRunner.query(`ALTER TABLE contratos RENAME COLUMN comision_plataforma TO porcentaje_comision`);
    }
}
exports.UpdateContractSystemAlter1750100000000 = UpdateContractSystemAlter1750100000000;
//# sourceMappingURL=1750100000000-UpdateContractSystemAlter.js.map