export const corsConfig = {
    development: {
      origins: [
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    },
    production: {
      origins: [
        'https://tu-dominio.com'
      ]
    }
  };
  
  export function getCorsOrigins(): string[] {
    const env = process.env.NODE_ENV || 'development';
    return corsConfig[env].origins;
  }