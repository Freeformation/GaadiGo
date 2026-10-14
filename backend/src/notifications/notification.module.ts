import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
