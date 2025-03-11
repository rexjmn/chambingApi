"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuthTables1709676000000 = void 0;
class CreateAuthTables1709676000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        user_id UUID NOT NULL,
        revoked BOOLEAN DEFAULT FALSE,
        ip_address INET,
        user_agent VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT fk_user FOREIGN KEY (user_id) 
          REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT uk_token UNIQUE (token)
      );

      CREATE INDEX idx_refresh_token_user ON refresh_tokens(user_id);
      CREATE INDEX idx_refresh_token_status ON refresh_tokens(revoked, expires_at);
    `);
        await queryRunner.query(`
      CREATE TABLE login_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        ip_address INET NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        successful BOOLEAN DEFAULT FALSE,
        user_agent VARCHAR(255),
        details JSONB,
        
        CONSTRAINT fk_email FOREIGN KEY (email) 
          REFERENCES usuarios(email) ON DELETE CASCADE
      );

      CREATE INDEX idx_login_attempts_email_ip ON login_attempts(email, ip_address);
      CREATE INDEX idx_login_attempts_timestamp ON login_attempts(timestamp);
      CREATE INDEX idx_login_attempts_successful ON login_attempts(successful);
      CREATE INDEX idx_login_attempts_details ON login_attempts USING gin(details);

      -- Add helpful comments for documentation
      COMMENT ON TABLE login_attempts IS 'Tracks login attempts and security blocks';
      COMMENT ON COLUMN login_attempts.details IS 'Stores additional information like attempt type, block reason, etc.';
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS login_attempts CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS refresh_tokens CASCADE;`);
    }
}
exports.CreateAuthTables1709676000000 = CreateAuthTables1709676000000;
//# sourceMappingURL=1709676000000-CreateAuthTables.js.map