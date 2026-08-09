import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [HealthController],
})
export class AppModule {}
