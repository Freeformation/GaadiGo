import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class KafkaEventModel {
  @Field(() => ID)
  id: string;

  @Field()
  topic: string;

  @Field()
  eventType: string; // vehicle.created, vehicle.approved, booking.created, payment.completed, etc.

  @Field()
  payload: string; // JSON string

  @Field()
  timestamp: string;

  @Field({ defaultValue: 'ACKNOWLEDGED' })
  status: string;
}
