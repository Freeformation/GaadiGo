import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KycDocument = Kyc & Document;

@Schema({ timestamps: true })
export class Kyc {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userPhone: string;

  @Prop({ required: true })
  userEmail: string;

  // India Parivahan Driving License
  @Prop({ required: true })
  dlNumber: string; // e.g. KA0120220019283

  @Prop({ required: true, enum: ['MCWOG', 'MCWG', 'LMV', 'LMV_AND_MCWG'] })
  dlCategory: string; // MCWOG=Scooty (without gear), MCWG=Motorcycle with gear, LMV=Car

  @Prop({ default: '2034-12-31' })
  dlExpiry: string;

  // India UIDAI Aadhaar via DigiLocker
  @Prop({ required: true })
  aadhaarMasked: string; // e.g. XXXX-XXXX-4819

  @Prop({ default: 'DIGILOCKER_PARIVAHAN_OK' })
  verificationStatus: string; // VERIFIED, PENDING, REJECTED

  @Prop({ default: true })
  isDigiLockerVerified: boolean;

  @Prop({ default: true })
  helmetDeclarationAccepted: boolean; // Mandatory for 2-wheelers

  @Prop({ default: '' })
  remarks: string;
}

export const KycSchema = SchemaFactory.createForClass(Kyc);
