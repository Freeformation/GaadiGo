import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateVehicleInput {
  @Field({ nullable: true })
  hostId?: string;

  @Field()
  hostName: string;

  @Field()
  hostPhone: string;

  @Field()
  title: string;

  @Field()
  category: string; // SCOOTY, BIKE, HATCHBACK, SEDAN, SUV, EV

  @Field()
  brand: string;

  @Field()
  modelName: string;

  @Field(() => Int)
  year: number;

  @Field()
  fuelType: string;

  @Field()
  transmission: string;

  @Field(() => Int, { defaultValue: 2 })
  seatingCapacity: number;

  // India Regulatory Fields
  @Field()
  registrationNumber: string;

  @Field({ defaultValue: 'YELLOW_COMMERCIAL' })
  plateType: string;

  @Field({ defaultValue: 'VERIFIED' })
  rcStatus: string;

  @Field({ nullable: true })
  rcDocumentUrl?: string;

  @Field()
  insurancePolicyNumber: string;

  @Field({ defaultValue: 'HDFC ERGO General Insurance' })
  insuranceCompany: string;

  @Field()
  insuranceExpiry: string;

  @Field({ nullable: true })
  pucExpiry?: string;

  @Field({ nullable: true })
  fastagId?: string;

  @Field({ defaultValue: false })
  speedGovernorFitted: boolean;

  @Field(() => Int, { defaultValue: 0 })
  helmetsProvided: number;

  @Field({ defaultValue: true })
  gpsTracked: boolean;

  // Location Hub
  @Field()
  city: string;

  @Field()
  areaHub: string;

  @Field({ nullable: true })
  pincode?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ defaultValue: true })
  doorstepDeliveryAvailable: boolean;

  @Field(() => Float, { defaultValue: 199 })
  doorstepDeliveryFee: number;

  // Pricing
  @Field(() => Float)
  hourlyRate: number;

  @Field(() => Float)
  dailyRate: number;

  @Field(() => Float)
  securityDeposit: number;

  @Field(() => Int, { defaultValue: 150 })
  kmLimitPerDay: number;

  @Field(() => Float, { defaultValue: 5 })
  extraKmCharge: number;

  @Field({ defaultValue: 'SAME_TO_SAME' })
  fuelPolicy: string;

  @Field(() => [String], { defaultValue: [] })
  images: string[];
}

@InputType()
export class VehicleFilterInput {
  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  fuelType?: string;

  @Field({ nullable: true })
  transmission?: string;

  @Field(() => Float, { nullable: true })
  maxDailyRate?: number;

  @Field({ nullable: true })
  status?: string;
}
