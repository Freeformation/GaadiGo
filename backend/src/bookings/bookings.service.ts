import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingInput } from './dto/booking.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private vehiclesService: VehiclesService,
    private kafkaService: KafkaProducerService,
  ) {}

  async create(input: CreateBookingInput): Promise<BookingDocument> {
    const vehicle = await this.vehiclesService.findById(input.vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle #${input.vehicleId} not found in inventory`);
    }

    if (vehicle.status !== 'APPROVED') {
      throw new BadRequestException(`Vehicle '${vehicle.title}' is not approved for public booking (status: ${vehicle.status}).`);
    }

    const totalDays = Math.max(1, input.totalDays || 1);
    const basePrice = vehicle.dailyRate * totalDays;
    const deliveryFee = input.pickupType === 'DOORSTEP_DELIVERY' ? vehicle.doorstepDeliveryFee : 0;
    const convenienceFee = 49;
    const securityDeposit = vehicle.securityDeposit;

    // 5% statutory GST on rental fee & convenience
    const taxableAmount = basePrice + deliveryFee + convenienceFee;
    const gstAmount = Math.round(taxableAmount * 0.05);
    const totalAmount = taxableAmount + gstAmount + securityDeposit;

    // Generate genuine 4-digit Indian pickup verification OTP
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Generate NPCI 12-digit standard UPI Reference Number (UTR)
    const utrTimestamp = Date.now().toString().slice(-6);
    const utrRandom = Math.floor(100000 + Math.random() * 900000).toString();
    const paymentTransactionId = `UPI/NPCI/${utrTimestamp}${utrRandom}`;

    const newBooking = new this.bookingModel({
      vehicleId: new Types.ObjectId(input.vehicleId),
      vehicleTitle: vehicle.title,
      vehicleRegistrationNumber: vehicle.registrationNumber,
      vehicleCategory: vehicle.category,
      vehicleImage: vehicle.images?.[0] || '',
      renterName: input.renterName.trim(),
      renterPhone: input.renterPhone.trim(),
      renterEmail: input.renterEmail.trim().toLowerCase(),
      hostName: vehicle.hostName,
      hostPhone: vehicle.hostPhone,
      startDate: input.startDate,
      endDate: input.endDate,
      totalDays,
      pickupType: input.pickupType,
      deliveryAddress: input.deliveryAddress || vehicle.areaHub,
      basePrice,
      deliveryFee,
      securityDeposit,
      gstAmount,
      convenienceFee,
      totalAmount,
      pickupOtp,
      paymentStatus: 'PAID',
      paymentMethod: input.paymentMethod || 'UPI_GPAY',
      paymentTransactionId,
      tripStatus: 'CONFIRMED',
      depositStatus: 'HELD_IN_ESCROW',
      digitalAgreementAccepted: true,
    });

    const saved = await newBooking.save();

    // Increment vehicle trip count in MongoDB
    vehicle.tripCount = (vehicle.tripCount || 0) + 1;
    await vehicle.save();

    // Emit Kafka events
    await this.kafkaService.emitEvent('vahaan.events', 'booking.created', {
      bookingId: saved._id,
      vehicleTitle: saved.vehicleTitle,
      registrationNumber: saved.vehicleRegistrationNumber,
      renterName: saved.renterName,
      renterPhone: saved.renterPhone,
      totalDays: saved.totalDays,
      totalAmount: saved.totalAmount,
      pickupOtp: saved.pickupOtp,
    });

    await this.kafkaService.emitEvent('vahaan.events', 'payment.completed', {
      bookingId: saved._id,
      paymentTransactionId: saved.paymentTransactionId,
      amount: saved.totalAmount,
      securityDeposit: saved.securityDeposit,
      paymentMethod: saved.paymentMethod,
      gateway: 'UPI_BHIM_NPCI',
      status: 'SUCCESS',
    });

    return saved;
  }

  async findAll(): Promise<BookingDocument[]> {
    return this.bookingModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByRenterPhone(phone: string): Promise<BookingDocument[]> {
    return this.bookingModel.find({ renterPhone: phone }).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async releaseSecurityDeposit(
    id: string,
    refundAmount: number,
    deductionReason?: string,
  ): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    const isFullRefund = refundAmount >= booking.securityDeposit;
    booking.depositStatus = isFullRefund ? 'REFUNDED_FULL' : 'DEDUCTED_PARTIAL';
    booking.depositRefundTxnId = `UPI/REF/${Date.now().toString().slice(-8)}`;
    if (deductionReason) {
      booking.depositDeductionReason = deductionReason;
    }

    const updated = await booking.save();

    await this.kafkaService.emitEvent('vahaan.events', 'deposit.refunded', {
      bookingId: updated._id,
      refundAmount,
      refundTxnId: updated.depositRefundTxnId,
      status: updated.depositStatus,
      deductionReason: deductionReason || 'Zero damages/challans post trip',
      renterPhone: updated.renterPhone,
    });

    return updated;
  }
}
