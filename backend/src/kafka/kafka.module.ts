import { Module, Global } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaResolver } from './kafka.resolver';

@Global()
@Module({
  providers: [KafkaProducerService, KafkaResolver],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
