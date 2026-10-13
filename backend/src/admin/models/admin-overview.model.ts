import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class AdminOverviewModel {
  @Field(() => Int)
  totalVehicles: number;

  @Field(() => Int)
  pendingApprovals: number;

  @Field(() => Int)
  activeRentals: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  securityDepositInEscrow: number;

  @Field(() => Int)
  totalVerifiedRenters: number;
}
