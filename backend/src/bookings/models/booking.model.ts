import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class BookingModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  vehicleId: string;

  @Field()
  vehicleTitle: string;

  @Field()
  vehicleRegistrationNumber: string;

  @Field()
  vehicleCategory: string;

  @Field()
  vehicleImage: string;

  @Field()
  renterName: string;

  @Field()
  renterPhone: string;

  @Field()
  renterEmail: string;

  @Field()
  hostName: string;

  @Field()
  hostPhone: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field(() => Int)
  totalDays: number;

  @Field()
  pickupType: string;

  @Field({ nullable: true })
  deliveryAddress?: string;

  @Field(() => Float)
  basePrice: number;

  @Field(() => Float)
  deliveryFee: number;

  @Field(() => Float)
  securityDeposit: number;

  @Field(() => Float)
  gstAmount: number;

  @Field(() => Float)
  convenienceFee: number;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  pickupOtp: string;

  @Field()
  paymentStatus: string;

  @Field()
  paymentMethod: string;

  @Field()
  paymentTransactionId: string;

  @Field()
  tripStatus: string;

  @Field()
  depositStatus: string;

  @Field({ nullable: true })
  depositDeductionReason?: string;

  @Field({ nullable: true })
  depositRefundTxnId?: string;

  @Field()
  digitalAgreementAccepted: boolean;

  @Field({ nullable: true })
  createdAt?: string;
}
