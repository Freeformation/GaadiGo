import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Faq')
export class FaqModel {
  @Field(() => ID)
  id: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field()
  category: string;

  @Field(() => Int)
  order: number;
}

@ObjectType('Review')
export class ReviewModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field()
  quote: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  vehicleTitle?: string;

  @Field({ nullable: true })
  city?: string;
}
