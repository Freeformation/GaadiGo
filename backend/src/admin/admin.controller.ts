import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // RBAC: Only ADMIN can access regulatory overview metrics
  @Get('overview')
  @Roles('ADMIN')
  async getOverview() {
    return this.adminService.getOverview();
  }
}
