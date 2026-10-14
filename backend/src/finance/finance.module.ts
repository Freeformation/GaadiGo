import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { FinanceService } from './finance.service';
import { FinanceResolver } from './finance.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [FinanceService, FinanceResolver],
  exports: [FinanceService],
})
export class FinanceModule {}
