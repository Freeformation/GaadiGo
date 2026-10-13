import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field(() => ID)
  vehicleId: string;

  @Field()
  renterName: string;

  @Field()
  renterPhone: string;

  @Field()
  renterEmail: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field(() => Int, { defaultValue: 1 })
  totalDays: number;

  @Field({ defaultValue: 'HUB_PICKUP' })
  pickupType: string;

  @Field({ nullable: true })
  deliveryAddress?: string;

  @Field({ defaultValue: 'UPI_GPAY' })
  paymentMethod: string;
}
