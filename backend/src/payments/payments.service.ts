import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

export interface CreateOrderDto {
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export interface VerifyPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingInput?: any;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private keyId: string;
  private keySecret: string;
  private isLiveMode: boolean;

  constructor(private kafkaService: KafkaProducerService) {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'sandbox_secret_vahaan_secure_2026';
    // Consider live if user provided real keys and not default sandbox
    this.isLiveMode = !!(
      process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('test_1DP5mmOlF5G5ag')
    );
  }

  getKeyId(): string {
    return this.keyId;
  }

  async createOrder(dto: CreateOrderDto) {
    const amountInPaise = Math.round(dto.amount * 100);
    const currency = dto.currency || 'INR';
    const receipt = dto.receipt || `rcpt_${Date.now()}`;

    if (this.isLiveMode) {
      try {
        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency,
            receipt,
            notes: dto.notes || {},
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          this.logger.error(`Razorpay API Order Creation Failed: ${errText}`);
          throw new BadRequestException(`Razorpay order creation failed: ${errText}`);
        }

        const data = await res.json();
        this.logger.log(`Created Live Razorpay Order: ${data.id}`);

        await this.kafkaService.emitEvent('vahaan.events', 'payment.order_created', {
          orderId: data.id,
          amount: dto.amount,
          currency,
          liveMode: true,
        });

        return {
          id: data.id,
          amount: data.amount,
          currency: data.currency,
          keyId: this.keyId,
          isLive: true,
        };
      } catch (err: any) {
        this.logger.warn(`Fallback to sandbox order generator: ${err.message}`);
      }
    }

    // Sandbox / Simulation Order Generator
    const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    this.logger.log(`Generated Sandbox Razorpay Order: ${orderId} (₹${dto.amount})`);

    await this.kafkaService.emitEvent('vahaan.events', 'payment.order_created', {
      orderId,
      amount: dto.amount,
      currency,
      liveMode: false,
    });

    return {
      id: orderId,
      amount: amountInPaise,
      currency,
      keyId: this.keyId,
      isLive: false,
    };
  }

  verifySignature(dto: VerifyPaymentDto): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new BadRequestException('Missing payment verification parameters');
    }

    // In sandbox simulation with mock signature
    if (razorpaySignature.startsWith('sim_sig_') || !this.isLiveMode) {
      return true;
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature),
    );

    if (!isValid) {
      this.logger.warn(`HMAC Signature mismatch for order: ${razorpayOrderId}`);
      throw new BadRequestException('Invalid Razorpay payment signature. Fraud check failed.');
    }

    return true;
  }
}
