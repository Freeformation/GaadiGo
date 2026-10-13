import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { AdminOverviewModel } from './models/admin-overview.model';
import { VehicleModel } from '../vehicles/models/vehicle.model';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => AdminOverviewModel, { name: 'getAdminOverview' })
  async getAdminOverview(): Promise<AdminOverviewModel> {
    return this.adminService.getOverview();
  }

  @Mutation(() => VehicleModel)
  async approveVehicleListing(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.adminService.approveListing(id);
  }

  @Mutation(() => VehicleModel)
  async rejectVehicleListing(
    @Args('id', { type: () => ID }) id: string,
    @Args('reason') reason: string,
  ): Promise<any> {
    return this.adminService.rejectListing(id, reason);
  }
}
