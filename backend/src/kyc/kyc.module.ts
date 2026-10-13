import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Kyc, KycSchema } from './schemas/kyc.schema';
import { KycService } from './kyc.service';
import { KycResolver } from './kyc.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Kyc.name, schema: KycSchema }])],
  providers: [KycService, KycResolver],
  exports: [KycService],
})
export class KycModule {}
