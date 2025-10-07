import { TypeOrmModuleOptions } from '@nestjs/typeorm';
declare const _default: (() => TypeOrmModuleOptions) & import("@nestjs/config").ConfigFactoryKeyHost<TypeOrmModuleOptions>;
export default _default;
export declare const corsConfig: {
    development: {
        origins: string[];
    };
    production: {
        origins: string[];
    };
};
export declare function getCorsOrigins(): string[];
