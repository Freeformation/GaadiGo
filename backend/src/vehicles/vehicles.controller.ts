import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleInput } from './dto/vehicle.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/vehicles')
@UseGuards(RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async getVehicles(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    const filter = {
      ...(city && city !== 'All Cities' ? { city } : {}),
      ...(category && category !== 'ALL' ? { category } : {}),
      ...(status ? { status } : {}),
    };
    return this.vehiclesService.findAll(filter);
  }

  @Get('cities')
  async getCities() {
    return this.vehiclesService.getCities();
  }

  @Get('category-rates')
  async getCategoryRates() {
    return this.vehiclesService.getCategoryRates();
  }

  @Get('stats')
  async getStats() {
    return this.vehiclesService.getStats();
  }

  @Get(':id')
  async getVehicleById(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  // RBAC: Only HOST and ADMIN can create vehicle listings
  @Post()
  @Roles('HOST', 'ADMIN')
  async createVehicle(@Body() input: CreateVehicleInput) {
    return this.vehiclesService.create(input);
  }

  // RBAC: Only ADMIN can approve vehicle listings
  @Patch(':id/approve')
  @Roles('ADMIN')
  async approveVehicle(@Param('id') id: string) {
    return this.vehiclesService.updateStatus(id, 'APPROVED');
  }

  // RBAC: Only ADMIN can reject vehicle listings
  @Patch(':id/reject')
  @Roles('ADMIN')
  async rejectVehicle(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.vehiclesService.updateStatus(id, 'REJECTED', reason || 'Non-compliant RTO documents');
  }
}
