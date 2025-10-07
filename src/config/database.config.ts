import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_servicios',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
}));

export const corsConfig = {
  development: {
    origins: [
      'http://localhost:5173',
      'http://localhost:3000'
    ]
  },
  production: {
    origins: [
      'https://chambing.pro',
      'https://www.chambing.pro'
    ]
  }
};

export function getCorsOrigins(): string[] {
  const env = process.env.NODE_ENV || 'development';
  return corsConfig[env].origins;
}