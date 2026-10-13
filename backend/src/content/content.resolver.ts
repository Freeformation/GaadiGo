import { Resolver, Query } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { FaqModel, ReviewModel } from './models/content.model';

@Resolver()
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [FaqModel], { name: 'getFaqs' })
  async getFaqs(): Promise<FaqModel[]> {
    const docs = await this.contentService.getFaqs();
    return docs.map((d) => ({
      id: d._id.toString(),
      question: d.question,
      answer: d.answer,
      category: d.category,
      order: d.order,
    }));
  }

  @Query(() => [ReviewModel], { name: 'getReviews' })
  async getReviews(): Promise<ReviewModel[]> {
    const docs = await this.contentService.getReviews();
    return docs.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      role: d.role,
      quote: d.quote,
      rating: d.rating,
      vehicleTitle: d.vehicleTitle,
      city: d.city,
    }));
  }
}
