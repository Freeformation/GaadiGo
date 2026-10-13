import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SubmitKycInput {
  @Field()
  userName: string;

  @Field()
  userPhone: string;

  @Field()
  userEmail: string;

  @Field()
  dlNumber: string;

  @Field({ defaultValue: 'LMV_AND_MCWG' })
  dlCategory: string;

  @Field({ defaultValue: '2034-12-31' })
  dlExpiry: string;

  @Field()
  aadhaarNumber: string; // Will be masked

  @Field({ defaultValue: true })
  helmetDeclarationAccepted: boolean;
}
