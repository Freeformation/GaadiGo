import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class KycModel {
  @Field(() => ID)
  id: string;

  @Field()
  userName: string;

  @Field()
  userPhone: string;

  @Field()
  userEmail: string;

  @Field()
  dlNumber: string;

  @Field()
  dlCategory: string;

  @Field()
  dlExpiry: string;

  @Field()
  aadhaarMasked: string;

  @Field()
  verificationStatus: string;

  @Field()
  isDigiLockerVerified: boolean;

  @Field()
  helmetDeclarationAccepted: boolean;

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  createdAt?: string;
}
