import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Kyc, KycSchema } from './schemas/kyc.schema';
import { KycService } from './kyc.service';
import { KycResolver } from './kyc.resolver';
import { KycController } from './kyc.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Kyc.name, schema: KycSchema }])],
  controllers: [KycController],
  providers: [KycService, KycResolver],
  exports: [KycService],
})
export class KycModule {}
