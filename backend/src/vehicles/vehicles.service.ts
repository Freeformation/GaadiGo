import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { CreateVehicleInput, VehicleFilterInput } from './dto/vehicle.dto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    private kafkaService: KafkaProducerService,
  ) {}

  async create(input: CreateVehicleInput): Promise<VehicleDocument> {
    // Determine initial approval status
    // Default to PENDING_APPROVAL unless already certified
    const newVehicle = new this.vehicleModel({
      ...input,
      hostId: input.hostId ? new Types.ObjectId(input.hostId) : undefined,
      status: 'PENDING_APPROVAL',
      rcStatus: 'PENDING',
      rating: 5.0,
      tripCount: 0,
    });

    const saved = await newVehicle.save();

    // Emit Kafka event
    await this.kafkaService.emitEvent('vahaan.events', 'vehicle.created', {
      vehicleId: saved._id,
      title: saved.title,
      category: saved.category,
      registrationNumber: saved.registrationNumber,
      plateType: saved.plateType,
      city: saved.city,
      dailyRate: saved.dailyRate,
      hostName: saved.hostName,
    });

    return saved;
  }

  async findAll(filter?: VehicleFilterInput): Promise<VehicleDocument[]> {
    const query: any = {};

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.city && filter.city !== 'All Cities') {
      query.city = { $regex: new RegExp(`^${filter.city}$`, 'i') };
    }

    if (filter?.category && filter.category !== 'ALL') {
      if (filter.category === 'CAR') {
        query.category = { $in: ['HATCHBACK', 'SEDAN', 'SUV'] };
      } else {
        query.category = filter.category;
      }
    }

    if (filter?.fuelType && filter.fuelType !== 'ALL') {
      query.fuelType = filter.fuelType;
    }

    if (filter?.transmission && filter.transmission !== 'ALL') {
      query.transmission = filter.transmission;
    }

    if (filter?.maxDailyRate) {
      query.dailyRate = { $lte: filter.maxDailyRate };
    }

    return this.vehicleModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }
    return vehicle;
  }

  async updateStatus(id: string, status: string, remarks?: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${id} not found`);
    }

    vehicle.status = status;
    if (remarks) {
      vehicle.adminRemarks = remarks;
    }
    if (status === 'APPROVED') {
      vehicle.rcStatus = 'VERIFIED';
    } else if (status === 'REJECTED') {
      vehicle.rcStatus = 'REJECTED';
    }

    const updated = await vehicle.save();

    await this.kafkaService.emitEvent('vahaan.events', 'vehicle.status_updated', {
      vehicleId: updated._id,
      newStatus: status,
      remarks: remarks || '',
      registrationNumber: updated.registrationNumber,
    });

    return updated;
  }

  async getStats(): Promise<{
    totalVehicles: number;
    activeListings: number;
    pendingApprovals: number;
    scootyCount: number;
    bikeCount: number;
    carCount: number;
    evCount: number;
  }> {
    const totalVehicles = await this.vehicleModel.countDocuments();
    const activeListings = await this.vehicleModel.countDocuments({ status: 'APPROVED' });
    const pendingApprovals = await this.vehicleModel.countDocuments({ status: 'PENDING_APPROVAL' });

    const scootyCount = await this.vehicleModel.countDocuments({ category: 'SCOOTY' });
    const bikeCount = await this.vehicleModel.countDocuments({ category: 'BIKE' });
    const carCount = await this.vehicleModel.countDocuments({
      category: { $in: ['HATCHBACK', 'SEDAN', 'SUV'] },
    });
    const evCount = await this.vehicleModel.countDocuments({
      $or: [{ category: 'EV' }, { fuelType: 'ELECTRIC' }],
    });

    return {
      totalVehicles,
      activeListings,
      pendingApprovals,
      scootyCount,
      bikeCount,
      carCount,
      evCount,
    };
  }

  async getCities(): Promise<string[]> {
    const rawCities = await this.vehicleModel.distinct('city').exec();
    const cleanCities = (rawCities as string[]).filter(Boolean);
    return ['All Cities', ...cleanCities.sort()];
  }

  async getCategoryRates(): Promise<Array<{ category: string; averageDailyRate: number; averageDeposit: number; count: number }>> {
    const categories = ['SCOOTY', 'BIKE', 'HATCHBACK', 'SUV', 'EV'];
    const results = [];

    for (const cat of categories) {
      let filter: any = { category: cat, status: 'APPROVED' };
      if (cat === 'EV') {
        filter = { $or: [{ category: 'EV' }, { fuelType: 'ELECTRIC' }], status: 'APPROVED' };
      }
      const vehicles = await this.vehicleModel.find(filter).exec();
      if (vehicles.length > 0) {
        const avgDaily = Math.round(vehicles.reduce((acc, v) => acc + (v.dailyRate || 0), 0) / vehicles.length);
        const avgDeposit = Math.round(vehicles.reduce((acc, v) => acc + (v.securityDeposit || 0), 0) / vehicles.length);
        results.push({
          category: cat,
          averageDailyRate: avgDaily,
          averageDeposit: avgDeposit,
          count: vehicles.length,
        });
      } else {
        // Fallback default base if category hasn't been listed yet
        const defaultRate = cat === 'SCOOTY' ? 449 : cat === 'BIKE' ? 899 : cat === 'HATCHBACK' ? 1499 : cat === 'SUV' ? 3499 : 599;
        const defaultDep = cat === 'SCOOTY' ? 500 : cat === 'BIKE' ? 1500 : cat === 'HATCHBACK' ? 2500 : cat === 'SUV' ? 5000 : 1000;
        results.push({
          category: cat,
          averageDailyRate: defaultRate,
          averageDeposit: defaultDep,
          count: 0,
        });
      }
    }
    return results;
  }
}

