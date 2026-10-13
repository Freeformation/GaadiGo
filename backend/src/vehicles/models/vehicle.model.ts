import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class VehicleModel {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  hostId?: string;

  @Field()
  hostName: string;

  @Field()
  hostPhone: string;

  @Field()
  title: string;

  @Field()
  category: string;

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

  @Field(() => Int)
  seatingCapacity: number;

  // India Regulatory & RTO Fields
  @Field()
  registrationNumber: string;

  @Field()
  plateType: string;

  @Field()
  rcStatus: string;

  @Field({ nullable: true })
  rcDocumentUrl?: string;

  @Field()
  insurancePolicyNumber: string;

  @Field()
  insuranceCompany: string;

  @Field()
  insuranceExpiry: string;

  @Field({ nullable: true })
  pucExpiry?: string;

  @Field({ nullable: true })
  fastagId?: string;

  @Field()
  speedGovernorFitted: boolean;

  @Field(() => Int)
  helmetsProvided: number;

  @Field()
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

  @Field()
  doorstepDeliveryAvailable: boolean;

  @Field(() => Float)
  doorstepDeliveryFee: number;

  // Pricing
  @Field(() => Float)
  hourlyRate: number;

  @Field(() => Float)
  dailyRate: number;

  @Field(() => Float)
  securityDeposit: number;

  @Field(() => Int)
  kmLimitPerDay: number;

  @Field(() => Float)
  extraKmCharge: number;

  @Field()
  fuelPolicy: string;

  @Field(() => [String])
  images: string[];

  @Field()
  status: string;

  @Field({ nullable: true })
  adminRemarks?: string;

  @Field(() => Float)
  rating: number;

  @Field(() => Int)
  tripCount: number;

  @Field({ nullable: true })
  createdAt?: string;
}

@ObjectType()
export class VehicleStatsModel {
  @Field(() => Int)
  totalVehicles: number;

  @Field(() => Int)
  activeListings: number;

  @Field(() => Int)
  pendingApprovals: number;

  @Field(() => Int)
  scootyCount: number;

  @Field(() => Int)
  bikeCount: number;

  @Field(() => Int)
  carCount: number;

  @Field(() => Int)
  evCount: number;
}
