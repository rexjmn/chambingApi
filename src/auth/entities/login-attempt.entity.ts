import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('login_attempts')
export class LoginAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ name: 'ip_address', type: 'inet' })
  ipAddress: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @Column({ default: false })
  successful: boolean;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}