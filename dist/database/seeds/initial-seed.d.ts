import { DataSource } from 'typeorm';
export declare function initialSeed(dataSource: DataSource): Promise<{
    rolesCreated: number;
    categoriesCreated: number;
    tariffsCreated: number;
}>;
