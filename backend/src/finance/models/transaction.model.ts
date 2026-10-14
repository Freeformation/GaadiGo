import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id: string;

  @Field()
  transactionId: string; // e.g. UPI/NPCI/20261014/991823 or ESCROW/HOLD/8921

  @Field()
  bookingId: string;

  @Field()
  vehicleTitle: string;

  @Field()
  vehicleRegistrationNumber: string;

  @Field()
  type: string; // 'BOOKING_PAYMENT' | 'ESCROW_HOLD' | 'ESCROW_REFUND' | 'HOST_PAYOUT'

  @Field(() => Float)
  amount: number;

  @Field()
  flow: string; // 'CREDIT' | 'DEBIT' | 'ESCROW_HELD'

  @Field()
  paymentMethod: string; // 'UPI_GPAY' | 'UPI_PHONEPE' | 'UPI_PAYTM' | 'IMPS_DIRECT' | 'ESCROW_AUTO_RELEASE'

  @Field()
  status: string; // 'SUCCESS' | 'HELD_IN_ESCROW' | 'REFUNDED' | 'PENDING_TRIP_END'

  @Field()
  partyName: string;

  @Field()
  partyPhone: string;

  @Field()
  partyRole: string; // 'RENTER' | 'HOST'

  @Field()
  description: string;

  @Field()
  createdAt: string;
}

@ObjectType()
export class FinanceSummaryModel {
  @Field(() => Float)
  totalSpent: number;

  @Field(() => Float)
  totalEarned: number;

  @Field(() => Float)
  escrowHeld: number;

  @Field(() => Float)
  escrowRefunded: number;

  @Field(() => Int)
  totalTransactions: number;
}
