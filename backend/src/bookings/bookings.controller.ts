import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingInput } from './dto/booking.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/bookings')
@UseGuards(RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() input: CreateBookingInput) {
    return this.bookingsService.create(input);
  }

  @Get()
  async getBookings() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Post(':id/release-deposit')
  @Roles('ADMIN')
  async releaseDeposit(
    @Param('id') id: string,
    @Body('refundAmount') refundAmount: number,
    @Body('deductionReason') deductionReason?: string,
  ) {
    return this.bookingsService.releaseSecurityDeposit(id, refundAmount, deductionReason);
  }
}
