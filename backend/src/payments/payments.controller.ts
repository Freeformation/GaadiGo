import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentsService, CreateOrderDto, VerifyPaymentDto } from './payments.service';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('config')
  getConfig() {
    return {
      keyId: this.paymentsService.getKeyId(),
    };
  }

  @Post('create-order')
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.paymentsService.createOrder(dto);
  }

  @Post('verify')
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    const isValid = this.paymentsService.verifySignature(dto);
    return {
      success: isValid,
      message: 'Payment signature verified successfully.',
      orderId: dto.razorpayOrderId,
      paymentId: dto.razorpayPaymentId,
    };
  }
}
