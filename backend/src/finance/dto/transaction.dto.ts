import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TransactionFilterInput {
  @Field({ nullable: true })
  type?: string; // 'BOOKING_PAYMENT' | 'ESCROW_HOLD' | 'ESCROW_REFUND' | 'HOST_PAYOUT' | 'ALL'

  @Field({ nullable: true })
  status?: string; // 'SUCCESS' | 'HELD_IN_ESCROW' | 'REFUNDED' | 'ALL'

  @Field({ nullable: true })
  search?: string; // UTR or vehicle registration search
}
