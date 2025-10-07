import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RequireRoles } from '../../auth/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
// Importa las entidades que tengas disponibles
// import { Contrato } from '../contracts/entities/contrato.entity';
// import { DocumentoTrabajador } from '../documents/entities/documento-trabajador.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin', 'super_admin')
export class AdminController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // @InjectRepository(Contrato)
    // private contratosRepository: Repository<Contrato>,
    // @InjectRepository(DocumentoTrabajador)
    // private documentosRepository: Repository<DocumentoTrabajador>,
  ) {}

  /**
   * Estadísticas generales del dashboard
   */
  @Get('stats')
  async getAdminStats(@Query('period') period: string = 'month') {
    const now = new Date();
    const currentPeriodStart = this.getPeriodStart(now, period);
    const previousPeriodStart = this.getPeriodStart(currentPeriodStart, period);

    // Usuarios
    const [
      totalUsers,
      currentPeriodUsers,
      previousPeriodUsers,
      totalWorkers,
      verifiedWorkers,
      pendingWorkers,
      totalClients
    ] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({
        where: { fecha_registro: MoreThanOrEqual(currentPeriodStart) }
      }),
      this.usersRepository.count({
        where: { 
          fecha_registro: Between(previousPeriodStart, currentPeriodStart)
        }
      }),
      this.usersRepository.count({ where: { tipo_usuario: 'trabajador' } }),
      this.usersRepository.count({ 
        where: { tipo_usuario: 'trabajador', verificado: true } 
      }),
      this.usersRepository.count({ 
        where: { tipo_usuario: 'trabajador', verificado: false } 
      }),
      this.usersRepository.count({ where: { tipo_usuario: 'cliente' } })
    ]);

    // Contratos - Comentado hasta que tengas la entidad
    // const [
    //   totalContracts,
    //   activeContracts,
    //   pendingContracts,
    //   completedContracts,
    //   cancelledContracts
    // ] = await Promise.all([
    //   this.contratosRepository.count(),
    //   this.contratosRepository.count({ where: { estado: 'en_progreso' } }),
    //   this.contratosRepository.count({ where: { estado: 'pendiente' } }),
    //   this.contratosRepository.count({ where: { estado: 'completado' } }),
    //   this.contratosRepository.count({ where: { estado: 'cancelado' } })
    // ]);

    // Documentos - Comentado hasta que tengas la entidad
    // const pendingDocuments = await this.documentosRepository.count({ 
    //   where: { estadoVerificacion: 'pendiente' } 
    // });

    // Ingresos del mes - Comentado hasta que tengas la entidad
    // const monthlyRevenue = await this.contratosRepository
    //   .createQueryBuilder('contrato')
    //   .select('SUM(contrato.monto)', 'total')
    //   .where('contrato.fecha_creacion >= :currentPeriodStart', { currentPeriodStart })
    //   .andWhere('contrato.estado = :estado', { estado: 'completado' })
    //   .getRawOne();

    return {
      status: 'success',
      data: {
        // Usuarios
        totalUsers,
        previousTotalUsers: totalUsers - currentPeriodUsers + previousPeriodUsers,
        totalWorkers,
        verifiedWorkers,
        pendingWorkers,
        totalClients,
        
        // Contratos (valores temporales hasta que implementes la entidad)
        activeContracts: 0,
        previousActiveContracts: 0,
        totalContracts: 0,
        contractsDistribution: {
          pending: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0
        },
        
        // Documentos (valores temporales)
        pendingDocuments: 0,
        previousPendingDocuments: 0,
        
        // Ingresos (valores temporales)
        monthlyRevenue: 0,
        previousMonthlyRevenue: 0,
        
        // Crecimiento
        userGrowth: currentPeriodUsers,
        userGrowthPercentage: this.calculateGrowthPercentage(
          currentPeriodUsers,
          previousPeriodUsers
        )
      }
    };
  }

  /**
   * Métricas detalladas del dashboard
   */
  @Get('metrics')
  async getDashboardMetrics() {
    const stats = await this.getAdminStats('month');
    
    // Crecimiento de usuarios por mes (últimos 12 meses)
    const userGrowthData = await this.getUserGrowthData();
    
    // Actividad reciente
    const recentActivity = await this.getRecentActivity();

    return {
      status: 'success',
      data: {
        ...stats.data,
        userGrowthData,
        recentActivity
      }
    };
  }

  /**
   * Obtener crecimiento de usuarios por mes
   */
  private async getUserGrowthData(): Promise<Array<{ month: string; users: number }>> {
    const months: Array<{ month: string; users: number; date: Date }> = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await this.usersRepository.count({
        where: {
          fecha_registro: Between(monthStart, monthEnd)
        }
      });

      months.push({
        month: monthStart.toLocaleString('en', { month: 'short' }),
        users: count,
        date: monthStart
      });
    }

    // Calcular usuarios acumulados
    let accumulated = 0;
    return months.map(m => {
      accumulated += m.users;
      return {
        month: m.month,
        users: accumulated
      };
    });
  }

  /**
   * Obtener actividad reciente del sistema
   */
  private async getRecentActivity() {
    // Últimos usuarios registrados
    const recentUsers = await this.usersRepository.find({
      order: { fecha_registro: 'DESC' },
      take: 5,
      select: ['id', 'nombre', 'apellido', 'tipo_usuario', 'fecha_registro', 'foto_perfil']
    });

    const activity = recentUsers.map(user => ({
      type: 'user',
      user: `${user.nombre} ${user.apellido}`,
      action: user.tipo_usuario === 'trabajador' ? 'registered as worker' : 'registered',
      timestamp: user.fecha_registro,
      avatar: user.foto_perfil || null,
      userType: user.tipo_usuario
    }));

    // Aquí podrías agregar más tipos de actividad cuando tengas las entidades:
    // - Contratos creados
    // - Documentos verificados
    // - Pagos procesados
    // etc.

    return activity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);
  }

  /**
   * Estadísticas de trabajadores
   */
  @Get('workers/stats')
  async getWorkersStats() {
    const [
      totalWorkers,
      verifiedWorkers,
      pendingWorkers,
      workersWithPhoto,
      workersWithSkills
    ] = await Promise.all([
      this.usersRepository.count({ where: { tipo_usuario: 'trabajador' } }),
      this.usersRepository.count({ 
        where: { tipo_usuario: 'trabajador', verificado: true } 
      }),
      this.usersRepository.count({ 
        where: { tipo_usuario: 'trabajador', verificado: false } 
      }),
      this.usersRepository
        .createQueryBuilder('user')
        .where('user.tipo_usuario = :tipo', { tipo: 'trabajador' })
        .andWhere('user.foto_perfil IS NOT NULL')
        .getCount(),
      // Esto depende de cómo tengas la relación con habilidades
      this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.habilidades', 'habilidades')
        .where('user.tipo_usuario = :tipo', { tipo: 'trabajador' })
        .andWhere('habilidades.id IS NOT NULL')
        .getCount()
    ]);

    return {
      status: 'success',
      data: {
        totalWorkers,
        verifiedWorkers,
        pendingWorkers,
        workersWithPhoto,
        workersWithSkills,
        verificationRate: totalWorkers > 0 
          ? ((verifiedWorkers / totalWorkers) * 100).toFixed(1)
          : 0
      }
    };
  }

  /**
   * Helpers
   */
  private getPeriodStart(date: Date, period: string): Date {
    const start = new Date(date);
    
    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }
    
    return start;
  }

  private calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }
}