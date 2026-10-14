import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document & { createdAt?: Date; updatedAt?: Date };

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicleId: Types.ObjectId;

  @Prop({ required: true })
  vehicleTitle: string;

  @Prop({ required: true })
  vehicleRegistrationNumber: string;

  @Prop({ required: true })
  vehicleCategory: string;

  @Prop({ default: '' })
  vehicleImage: string;

  @Prop({ required: true })
  renterName: string;

  @Prop({ required: true })
  renterPhone: string;

  @Prop({ required: true })
  renterEmail: string;

  @Prop({ required: true })
  hostName: string;

  @Prop({ required: true })
  hostPhone: string;

  @Prop({ required: true })
  startDate: string; // ISO date string

  @Prop({ required: true })
  endDate: string; // ISO date string

  @Prop({ default: 1 })
  totalDays: number;

  @Prop({ default: 'HUB_PICKUP', enum: ['HUB_PICKUP', 'DOORSTEP_DELIVERY'] })
  pickupType: string;

  @Prop({ default: '' })
  deliveryAddress: string;

  // Financials (in INR)
  @Prop({ required: true })
  basePrice: number;

  @Prop({ default: 0 })
  deliveryFee: number;

  @Prop({ required: true })
  securityDeposit: number; // Held in escrow

  @Prop({ required: true })
  gstAmount: number; // 5% GST

  @Prop({ default: 49 })
  convenienceFee: number;

  @Prop({ required: true })
  totalAmount: number;

  // Verification & Security
  @Prop({ required: true })
  pickupOtp: string; // 4-digit OTP

  @Prop({ default: 'PAID', enum: ['PENDING', 'PAID', 'REFUNDED'] })
  paymentStatus: string;

  @Prop({ default: 'UPI_GPAY' })
  paymentMethod: string;

  @Prop({ required: true })
  paymentTransactionId: string;

  @Prop({ default: 'CONFIRMED', enum: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  tripStatus: string;

  @Prop({ default: 'HELD_IN_ESCROW', enum: ['HELD_IN_ESCROW', 'REFUNDED_FULL', 'DEDUCTED_PARTIAL'] })
  depositStatus: string;

  @Prop({ default: '' })
  depositDeductionReason: string;

  @Prop({ default: '' })
  depositRefundTxnId: string;

  @Prop({ default: true })
  digitalAgreementAccepted: boolean;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
