import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ defaultValue: '' })
  phone: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  role: string;

  @Field()
  isKycVerified: boolean;

  @Field({ nullable: true })
  dlNumber?: string;

  @Field({ nullable: true })
  dlCategory?: string;

  @Field({ nullable: true })
  aadhaarMasked?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  createdAt?: string;
}

@ObjectType()
export class AuthPayloadModel {
  @Field()
  token: string;

  @Field(() => UserModel)
  user: UserModel;
}
