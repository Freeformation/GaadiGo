import { Module, Global } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaResolver } from './kafka.resolver';
import { KafkaController } from './kafka.controller';

@Global()
@Module({
  controllers: [KafkaController],
  providers: [KafkaProducerService, KafkaResolver],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
