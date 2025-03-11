import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule)
  ],
  providers: [AwsService],
  controllers: [AwsController],
  exports: [AwsService],
})
export class AwsModule {}