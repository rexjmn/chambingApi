import { User } from '../../modules/users/entities/user.entity';
export declare class RefreshToken {
    id: string;
    token: string;
    expiresAt: Date;
    user: User;
    revoked: boolean;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
    isActive(): boolean;
}
