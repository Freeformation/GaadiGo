import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { AdminController } from './admin.controller';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Kyc, KycSchema } from '../kyc/schemas/kyc.schema';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Kyc.name, schema: KycSchema },
    ]),
    VehiclesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminResolver],
  exports: [AdminService],
})
export class AdminModule {}
