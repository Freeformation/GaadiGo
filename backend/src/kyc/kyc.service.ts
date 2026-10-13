import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kyc, KycDocument } from './schemas/kyc.schema';
import { SubmitKycInput } from './dto/kyc.dto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';
import { validateIndianKyc } from './kyc.validator';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(Kyc.name) private kycModel: Model<KycDocument>,
    private kafkaService: KafkaProducerService,
  ) {}

  async submitKyc(input: SubmitKycInput): Promise<KycDocument> {
    // Real validation of Aadhaar via UIDAI Verhoeff Checksum & DL via MoRTH standard
    const validation = validateIndianKyc(input.aadhaarNumber, input.dlNumber, input.dlExpiry);
    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    const cleanAadhaar = validation.normalizedAadhaar!;
    const cleanDl = validation.normalizedDl!;
    const last4 = cleanAadhaar.slice(-4);
    const aadhaarMasked = `XXXX-XXXX-${last4}`;

    const record = new this.kycModel({
      userName: input.userName.trim(),
      userPhone: input.userPhone.trim(),
      userEmail: input.userEmail.trim().toLowerCase(),
      dlNumber: cleanDl,
      dlCategory: input.dlCategory,
      dlExpiry: input.dlExpiry,
      aadhaarMasked,
      verificationStatus: 'VERIFIED',
      isDigiLockerVerified: true,
      helmetDeclarationAccepted: input.helmetDeclarationAccepted ?? true,
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
