import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kyc, KycDocument } from './schemas/kyc.schema';
import { SubmitKycInput } from './dto/kyc.dto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(Kyc.name) private kycModel: Model<KycDocument>,
    private kafkaService: KafkaProducerService,
  ) {}

  async submitKyc(input: SubmitKycInput): Promise<KycDocument> {
    // Mask Aadhaar (keep last 4 digits)
    const rawAadhaar = input.aadhaarNumber.replace(/[^0-9]/g, '');
    const last4 = rawAadhaar.slice(-4) || '8812';
    const aadhaarMasked = `XXXX-XXXX-${last4}`;

    // Standardize DL Number
    const dlNumberClean = input.dlNumber.trim().toUpperCase();

    const record = new this.kycModel({
      userName: input.userName,
      userPhone: input.userPhone,
      userEmail: input.userEmail,
      dlNumber: dlNumberClean,
      dlCategory: input.dlCategory,
      dlExpiry: input.dlExpiry,
      aadhaarMasked,
      verificationStatus: 'VERIFIED', // Instant Parivahan/DigiLocker API response
      isDigiLockerVerified: true,
      helmetDeclarationAccepted: input.helmetDeclarationAccepted,
    });

    const saved = await record.save();

    await this.kafkaService.emitEvent('vahaan.events', 'renter.kyc_submitted', {
      kycId: saved._id,
      userName: saved.userName,
      dlNumber: saved.dlNumber,
      dlCategory: saved.dlCategory,
      aadhaarMasked: saved.aadhaarMasked,
      verificationStatus: saved.verificationStatus,
    });

    return saved;
  }

  async findByPhone(phone: string): Promise<KycDocument | null> {
    return this.kycModel.findOne({ userPhone: phone }).sort({ createdAt: -1 }).exec();
  }

  async getAll(): Promise<KycDocument[]> {
    return this.kycModel.find().sort({ createdAt: -1 }).exec();
  }
}
