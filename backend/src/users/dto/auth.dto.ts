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
