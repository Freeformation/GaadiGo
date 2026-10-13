import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../vehicles/schemas/vehicle.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { Kyc, KycDocument } from '../kyc/schemas/kyc.schema';
import { VehiclesService } from '../vehicles/vehicles.service';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Kyc.name) private kycModel: Model<KycDocument>,
    private vehiclesService: VehiclesService,
    private kafkaService: KafkaProducerService,
  ) {}

  async getOverview() {
    const totalVehicles = await this.vehicleModel.countDocuments();
    const pendingApprovals = await this.vehicleModel.countDocuments({ status: 'PENDING_APPROVAL' });
    const activeRentals = await this.bookingModel.countDocuments({ tripStatus: 'CONFIRMED' });

    const bookings = await this.bookingModel.find().exec();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const securityDepositInEscrow = bookings
      .filter((b) => b.depositStatus === 'HELD_IN_ESCROW')
      .reduce((sum, b) => sum + (b.securityDeposit || 0), 0);

    const totalVerifiedRenters = await this.kycModel.countDocuments({ verificationStatus: 'VERIFIED' });

    return {
      totalVehicles,
      pendingApprovals,
      activeRentals,
      totalRevenue,
      securityDepositInEscrow,
      totalVerifiedRenters,
    };
  }

  async approveListing(id: string) {
    const updated = await this.vehiclesService.updateStatus(id, 'APPROVED', 'Verified by Admin Compliance');
    await this.kafkaService.emitEvent('vahaan.events', 'vehicle.approved', {
      vehicleId: updated._id,
      title: updated.title,
      registrationNumber: updated.registrationNumber,
      approvedAt: new Date().toISOString(),
    });
    return updated;
  }

  async rejectListing(id: string, reason: string) {
    const updated = await this.vehiclesService.updateStatus(id, 'REJECTED', reason);
    await this.kafkaService.emitEvent('vahaan.events', 'vehicle.rejected', {
      vehicleId: updated._id,
      title: updated.title,
      registrationNumber: updated.registrationNumber,
      reason,
      rejectedAt: new Date().toISOString(),
    });
    return updated;
  }
}
