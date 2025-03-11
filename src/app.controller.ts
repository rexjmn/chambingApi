import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
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