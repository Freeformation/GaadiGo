import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ defaultValue: '' })
  phone: string;

  @Field({ defaultValue: 'RENTER' })
  role: string; // RENTER or HOST

  @Field({ defaultValue: 'Bengaluru' })
  city: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  dlNumber?: string;

  @Field({ nullable: true })
  dlCategory?: string;

  @Field({ nullable: true })
  aadhaarMasked?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  email: string;

  @Field()
  otp: string;

  @Field()
  newPassword: string;
}

