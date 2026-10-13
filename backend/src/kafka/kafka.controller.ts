import { Controller, Get } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';

@Controller('api/kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaProducerService) {}

  @Get('events')
  async getEvents() {
    return this.kafkaService.getRecentEvents();
  }
}
