import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminOverviewModel } from './models/admin-overview.model';
import { VehicleModel } from '../vehicles/models/vehicle.model';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver()
@UseGuards(RolesGuard)
@Roles('ADMIN')
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
