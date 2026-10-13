import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { KycService } from './kyc.service';
import { KycModel } from './models/kyc.model';
import { SubmitKycInput } from './dto/kyc.dto';

@Resolver(() => KycModel)
export class KycResolver {
  constructor(private readonly kycService: KycService) {}

  @Query(() => [KycModel], { name: 'getKycRecords' })
  async getKycRecords(): Promise<KycModel[]> {
    const records = await this.kycService.getAll();
    return records.map((r) => this.mapToModel(r));
  }

  @Query(() => KycModel, { name: 'getKycByPhone', nullable: true })
  async getKycByPhone(@Args('phone') phone: string): Promise<KycModel | null> {
    const record = await this.kycService.findByPhone(phone);
    if (!record) return null;
    return this.mapToModel(record);
  }

  @Mutation(() => KycModel)
  async submitKyc(@Args('input') input: SubmitKycInput): Promise<KycModel> {
    const record = await this.kycService.submitKyc(input);
    return this.mapToModel(record);
  }

  private mapToModel(r: any): KycModel {
    return {
      id: r._id.toString(),
      userName: r.userName,
      userPhone: r.userPhone,
      userEmail: r.userEmail,
      dlNumber: r.dlNumber,
      dlCategory: r.dlCategory,
      dlExpiry: r.dlExpiry,
      aadhaarMasked: r.aadhaarMasked,
      verificationStatus: r.verificationStatus,
      isDigiLockerVerified: r.isDigiLockerVerified,
      helmetDeclarationAccepted: r.helmetDeclarationAccepted,
      remarks: r.remarks,
      createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    };
  }
}
