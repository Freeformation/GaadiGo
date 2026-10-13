import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

export interface DomainEvent {
  id: string;
  topic: string;
  eventType: string;
  payload: any;
  timestamp: string;
  status: string;
}

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private kafka: Kafka;
  private producer: Producer;
  private isConnected = false;
  private eventHistory: DomainEvent[] = [];

  constructor() {
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9094,localhost:9092').split(',');
    this.kafka = new Kafka({
      clientId: 'vahaan-backend',
      brokers,
      connectionTimeout: 4000,
      retry: {
        initialRetryTime: 300,
        retries: 3,
      },
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to Apache Kafka broker cluster');
    } catch (err: any) {
      this.logger.warn(`Kafka broker connection failed (${err.message}). Running in resilient fallback mode.`);
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.producer.disconnect();
    }
  }

  async emitEvent(topic: string, eventType: string, payload: any): Promise<DomainEvent> {
    const event: DomainEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      topic,
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      status: this.isConnected ? 'PRODUCED_TO_KAFKA' : 'SAVED_LOCAL_QUEUE',
    };

    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 200) {
      this.eventHistory.pop();
    }

    if (this.isConnected) {
      try {
        await this.producer.send({
          topic,
          messages: [
            {
              key: eventType,
              value: JSON.stringify({
                eventId: event.id,
                eventType,
                timestamp: event.timestamp,
                data: payload,
              }),
            },
          ],
        });
        this.logger.log(`Kafka Event Emitted -> Topic: ${topic} | Type: ${eventType}`);
      } catch (err: any) {
        this.logger.error(`Error sending message to Kafka: ${err.message}`);
        event.status = 'KAFKA_SEND_ERROR';
      }
    } else {
      this.logger.log(`[Kafka Standalone Mode] Event Logged: ${eventType}`);
    }

    return event;
  }

  getRecentEvents(): DomainEvent[] {
    return this.eventHistory;
  }
}
