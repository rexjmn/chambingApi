import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddMissingUserColumns1750000000002 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
