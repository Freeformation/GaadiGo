import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Kyc, KycSchema } from '../kyc/schemas/kyc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: User.name, schema: UserSchema },
      { name: Kyc.name, schema: KycSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
