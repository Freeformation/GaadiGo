import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  passwordHash: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: 'RENTER', enum: ['HOST', 'RENTER', 'ADMIN'] })
  role: string;

  @Prop({ default: false })
  isKycVerified: boolean;

  @Prop({ default: '' })
  dlNumber: string;

  @Prop({ default: '' })
  dlCategory: string; // MCWOG, MCWG, LMV, LMV_AND_MCWG

  @Prop({ default: '' })
  aadhaarMasked: string;

  @Prop({ default: '' })
  city: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
