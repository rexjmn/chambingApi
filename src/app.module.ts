import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ServicesModule } from './modules/services/services.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AppController } from './app.controller';
import { AwsModule } from './modules/aws/aws.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { SkillsModule } from './modules/skills/skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          ...dbConfig,
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    ServicesModule,
    ContractsModule,
    DocumentsModule,
    SkillsModule,
    AwsModule,
     AdminModule,
    PaymentsModule, 
  ],
  controllers: [AppController],
})
export class AppModule {}