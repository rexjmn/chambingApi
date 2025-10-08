import { Controller, Get } from '@nestjs/common';

@Controller() // Sin prefijo - responde en /
export class AppController {
  
  @Get() // Esto responde en /
  getRoot() {
    return {
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString()
    };
  }

  @Get('api') // Esto responde en /api
  getHello() {
    return {
      status: 'success',
      message: 'Welcome to Services API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        roles: '/api/roles',
        services: '/api/services',
        contracts: '/api/contracts',
        documents: '/api/documents'
      }
    };
  }
}