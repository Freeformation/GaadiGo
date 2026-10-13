import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { VehicleModel, VehicleStatsModel } from './models/vehicle.model';
import { CreateVehicleInput, VehicleFilterInput } from './dto/vehicle.dto';

@Resolver(() => VehicleModel)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => [VehicleModel], { name: 'getVehicles' })
  async getVehicles(
    @Args('filter', { nullable: true }) filter?: VehicleFilterInput,
  ): Promise<VehicleModel[]> {
    const docs = await this.vehiclesService.findAll(filter);
    return docs.map((doc) => this.mapToModel(doc));
  }

  @Query(() => VehicleModel, { name: 'getVehicleById' })
  async getVehicleById(@Args('id', { type: () => ID }) id: string): Promise<VehicleModel> {
    const doc = await this.vehiclesService.findById(id);
    return this.mapToModel(doc);
  }

  @Query(() => VehicleStatsModel, { name: 'getVehicleStats' })
  async getVehicleStats(): Promise<VehicleStatsModel> {
    return this.vehiclesService.getStats();
  }

  @Mutation(() => VehicleModel)
  async createVehicle(@Args('input') input: CreateVehicleInput): Promise<VehicleModel> {
    const doc = await this.vehiclesService.create(input);
    return this.mapToModel(doc);
  }

  @Mutation(() => VehicleModel)
  async updateVehicleStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status') status: string,
    @Args('remarks', { nullable: true }) remarks?: string,
  ): Promise<VehicleModel> {
    const doc = await this.vehiclesService.updateStatus(id, status, remarks);
    return this.mapToModel(doc);
  }

  private mapToModel(doc: any): VehicleModel {
    return {
      id: doc._id.toString(),
      hostId: doc.hostId ? doc.hostId.toString() : null,
      hostName: doc.hostName,
      hostPhone: doc.hostPhone,
      title: doc.title,
      category: doc.category,
      brand: doc.brand,
      modelName: doc.modelName,
      year: doc.year,
      fuelType: doc.fuelType,
      transmission: doc.transmission,
      seatingCapacity: doc.seatingCapacity,
      registrationNumber: doc.registrationNumber,
      plateType: doc.plateType,
      rcStatus: doc.rcStatus,
      rcDocumentUrl: doc.rcDocumentUrl,
      insurancePolicyNumber: doc.insurancePolicyNumber,
      insuranceCompany: doc.insuranceCompany,
      insuranceExpiry: doc.insuranceExpiry,
      pucExpiry: doc.pucExpiry,
      fastagId: doc.fastagId,
      speedGovernorFitted: doc.speedGovernorFitted,
      helmetsProvided: doc.helmetsProvided,
      gpsTracked: doc.gpsTracked,
      city: doc.city,
      areaHub: doc.areaHub,
      pincode: doc.pincode,
      address: doc.address,
      doorstepDeliveryAvailable: doc.doorstepDeliveryAvailable,
      doorstepDeliveryFee: doc.doorstepDeliveryFee,
      hourlyRate: doc.hourlyRate,
      dailyRate: doc.dailyRate,
      securityDeposit: doc.securityDeposit,
      kmLimitPerDay: doc.kmLimitPerDay,
      extraKmCharge: doc.extraKmCharge,
      fuelPolicy: doc.fuelPolicy,
      images: doc.images || [],
      status: doc.status,
      adminRemarks: doc.adminRemarks,
      rating: doc.rating,
      tripCount: doc.tripCount,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    };
  }
}
