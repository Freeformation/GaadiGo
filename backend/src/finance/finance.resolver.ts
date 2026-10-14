import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { FinanceService } from './finance.service';
import { TransactionModel, FinanceSummaryModel } from './models/transaction.model';
import { TransactionFilterInput } from './dto/transaction.dto';

@Resolver(() => TransactionModel)
export class FinanceResolver {
  constructor(private readonly financeService: FinanceService) {}

  @Query(() => [TransactionModel], { name: 'getTransactionHistory' })
  async getTransactionHistory(
    @Context() context: any,
    @Args('filter', { nullable: true }) filter?: TransactionFilterInput,
  ): Promise<TransactionModel[]> {
    const user = context?.req?.user;
    return this.financeService.getTransactionHistory(user, filter);
  }

  @Query(() => FinanceSummaryModel, { name: 'getFinanceSummary' })
  async getFinanceSummary(@Context() context: any): Promise<FinanceSummaryModel> {
    const user = context?.req?.user;
    return this.financeService.getFinanceSummary(user);
  }
}
