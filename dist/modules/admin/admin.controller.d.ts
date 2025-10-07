import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class AdminController {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    getAdminStats(period?: string): Promise<{
        status: string;
        data: {
            totalUsers: number;
            previousTotalUsers: number;
            totalWorkers: number;
            verifiedWorkers: number;
            pendingWorkers: number;
            totalClients: number;
            activeContracts: number;
            previousActiveContracts: number;
            totalContracts: number;
            contractsDistribution: {
                pending: number;
                inProgress: number;
                completed: number;
                cancelled: number;
            };
            pendingDocuments: number;
            previousPendingDocuments: number;
            monthlyRevenue: number;
            previousMonthlyRevenue: number;
            userGrowth: number;
            userGrowthPercentage: number;
        };
    }>;
    getDashboardMetrics(): Promise<{
        status: string;
        data: {
            userGrowthData: {
                month: string;
                users: number;
            }[];
            recentActivity: {
                type: string;
                user: string;
                action: string;
                timestamp: Date;
                avatar: string | null;
                userType: string;
            }[];
            totalUsers: number;
            previousTotalUsers: number;
            totalWorkers: number;
            verifiedWorkers: number;
            pendingWorkers: number;
            totalClients: number;
            activeContracts: number;
            previousActiveContracts: number;
            totalContracts: number;
            contractsDistribution: {
                pending: number;
                inProgress: number;
                completed: number;
                cancelled: number;
            };
            pendingDocuments: number;
            previousPendingDocuments: number;
            monthlyRevenue: number;
            previousMonthlyRevenue: number;
            userGrowth: number;
            userGrowthPercentage: number;
        };
    }>;
    private getUserGrowthData;
    private getRecentActivity;
    getWorkersStats(): Promise<{
        status: string;
        data: {
            totalWorkers: number;
            verifiedWorkers: number;
            pendingWorkers: number;
            workersWithPhoto: number;
            workersWithSkills: number;
            verificationRate: string | number;
        };
    }>;
    private getPeriodStart;
    private calculateGrowthPercentage;
}
