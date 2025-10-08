import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  private startTime = Date.now();
  
  @Get()
  getHello() {
    // Espera 3 segundos después del inicio antes de responder OK
    const uptime = Date.now() - this.startTime;
    if (uptime < 3000) {
      throw new Error('Starting up...');
    }
    
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