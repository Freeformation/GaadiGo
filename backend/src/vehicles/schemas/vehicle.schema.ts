import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  hostId: Types.ObjectId;

  @Prop({ required: true })
  hostName: string;

  @Prop({ required: true })
  hostPhone: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['SCOOTY', 'BIKE', 'HATCHBACK', 'SEDAN', 'SUV', 'EV'] })
  category: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, enum: ['PETROL', 'DIESEL', 'ELECTRIC', 'CNG'] })
  fuelType: string;

  @Prop({ required: true, enum: ['AUTOMATIC', 'MANUAL'] })
  transmission: string;

  @Prop({ default: 2 })
  seatingCapacity: number;

  // India Regulatory & RTO Compliance
  @Prop({ required: true })
  registrationNumber: string; // e.g. KA-01-AB-1234

  @Prop({
    default: 'YELLOW_COMMERCIAL',
    enum: ['YELLOW_COMMERCIAL', 'BLACK_YELLOW_RENTAL', 'PRIVATE_P2P_LEASE'],
  })
  plateType: string;

  @Prop({ default: 'VERIFIED', enum: ['PENDING', 'VERIFIED', 'REJECTED'] })
  rcStatus: string;

  @Prop({ default: '' })
  rcDocumentUrl: string;

  @Prop({ required: true })
  insurancePolicyNumber: string;

  @Prop({ default: 'HDFC ERGO General Insurance' })
  insuranceCompany: string;

  @Prop({ required: true })
  insuranceExpiry: string; // YYYY-MM-DD

  @Prop({ default: '' })
  pucExpiry: string; // YYYY-MM-DD (mandatory for non-EV)

  @Prop({ default: '' })
  fastagId: string; // NPCI FASTag ID for 4W

  @Prop({ default: false })
  speedGovernorFitted: boolean; // MoRTH 80km/h commercial rule

  @Prop({ default: 0 })
  helmetsProvided: number; // 1 or 2 for two-wheelers

  @Prop({ default: true })
  gpsTracked: boolean;

  // Location Hub
  @Prop({ required: true })
  city: string; // Bengaluru, Goa, Delhi NCR, Mumbai, Hyderabad, Pune, Rishikesh

  @Prop({ required: true })
  areaHub: string; // e.g. Indiranagar, Calangute, Cyber Hub

  @Prop({ default: '' })
  pincode: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: true })
  doorstepDeliveryAvailable: boolean;

  @Prop({ default: 199 })
  doorstepDeliveryFee: number;

  // Pricing & Security Deposit
  @Prop({ required: true })
  hourlyRate: number; // INR

  @Prop({ required: true })
  dailyRate: number; // INR

  @Prop({ required: true })
  securityDeposit: number; // Refundable INR (e.g. 500 for scooty, 3000 for car)

  @Prop({ default: 150 })
  kmLimitPerDay: number; // 0 = unlimited

  @Prop({ default: 5 })
  extraKmCharge: number; // INR per extra km

  @Prop({ default: 'SAME_TO_SAME', enum: ['SAME_TO_SAME', 'FULL_CHARGE'] })
  fuelPolicy: string;

  // Media & Metadata
  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    default: 'PENDING_APPROVAL',
    enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'RENTED', 'MAINTENANCE'],
  })
  status: string;

  @Prop({ default: '' })
  adminRemarks: string;

  @Prop({ default: 4.8 })
  rating: number;

  @Prop({ default: 0 })
  tripCount: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
