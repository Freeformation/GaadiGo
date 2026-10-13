import { Resolver, Query } from '@nestjs/graphql';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaEventModel } from './models/kafka-event.model';

@Resolver(() => KafkaEventModel)
export class KafkaResolver {
  constructor(private readonly kafkaService: KafkaProducerService) {}

  @Query(() => [KafkaEventModel], { name: 'getKafkaAuditEvents' })
  getKafkaAuditEvents(): KafkaEventModel[] {
    const events = this.kafkaService.getRecentEvents();
    return events.map((e) => ({
      id: e.id,
      topic: e.topic,
      eventType: e.eventType,
      payload: JSON.stringify(e.payload),
      timestamp: e.timestamp,
      status: e.status,
    }));
  }
}
