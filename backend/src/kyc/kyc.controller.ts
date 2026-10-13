import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycInput } from './dto/kyc.dto';

@Controller('api/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('verify')
  async verifyKyc(@Body() input: SubmitKycInput) {
    return this.kycService.submitKyc(input);
  }

  @Get(':phone')
  async getKycByPhone(@Param('phone') phone: string) {
    return this.kycService.findByPhone(phone);
  }

  @Get()
  async getAllKyc() {
    return this.kycService.getAll();
  }
}
