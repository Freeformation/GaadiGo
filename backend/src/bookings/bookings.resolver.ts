import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingModel } from './models/booking.model';
import { CreateBookingInput } from './dto/booking.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver(() => BookingModel)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Query(() => [BookingModel], { name: 'getBookings' })
  async getBookings(): Promise<BookingModel[]> {
    const docs = await this.bookingsService.findAll();
    return docs.map((d) => this.mapToModel(d));
  }

  @Query(() => [BookingModel], { name: 'getBookingsByPhone' })
  async getBookingsByPhone(@Args('phone') phone: string): Promise<BookingModel[]> {
    const docs = await this.bookingsService.findByRenterPhone(phone);
    return docs.map((d) => this.mapToModel(d));
  }

  @Query(() => BookingModel, { name: 'getBookingById' })
  async getBookingById(@Args('id', { type: () => ID }) id: string): Promise<BookingModel> {
    const doc = await this.bookingsService.findById(id);
    return this.mapToModel(doc);
  }

  @Mutation(() => BookingModel)
  async createBooking(@Args('input') input: CreateBookingInput): Promise<BookingModel> {
    const doc = await this.bookingsService.create(input);
    return this.mapToModel(doc);
  }

  @Mutation(() => BookingModel)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async releaseSecurityDeposit(
    @Args('id', { type: () => ID }) id: string,
    @Args('refundAmount', { type: () => Float }) refundAmount: number,
    @Args('deductionReason', { nullable: true }) deductionReason?: string,
  ): Promise<BookingModel> {
    const doc = await this.bookingsService.releaseSecurityDeposit(id, refundAmount, deductionReason);
    return this.mapToModel(doc);
  }

  private mapToModel(d: any): BookingModel {
    return {
      id: d._id.toString(),
      vehicleId: d.vehicleId.toString(),
      vehicleTitle: d.vehicleTitle,
      vehicleRegistrationNumber: d.vehicleRegistrationNumber,
      vehicleCategory: d.vehicleCategory,
      vehicleImage: d.vehicleImage,
      renterName: d.renterName,
      renterPhone: d.renterPhone,
      renterEmail: d.renterEmail,
      hostName: d.hostName,
      hostPhone: d.hostPhone,
      startDate: d.startDate,
      endDate: d.endDate,
      totalDays: d.totalDays,
      pickupType: d.pickupType,
      deliveryAddress: d.deliveryAddress,
      basePrice: d.basePrice,
      deliveryFee: d.deliveryFee,
      securityDeposit: d.securityDeposit,
      gstAmount: d.gstAmount,
      convenienceFee: d.convenienceFee,
      totalAmount: d.totalAmount,
      pickupOtp: d.pickupOtp,
      paymentStatus: d.paymentStatus,
      paymentMethod: d.paymentMethod,
      paymentTransactionId: d.paymentTransactionId,
      tripStatus: d.tripStatus,
      depositStatus: d.depositStatus,
      depositDeductionReason: d.depositDeductionReason,
      depositRefundTxnId: d.depositRefundTxnId,
      digitalAgreementAccepted: d.digitalAgreementAccepted,
      createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
    };
  }
}
