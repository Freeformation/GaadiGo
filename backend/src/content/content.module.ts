import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Faq, FaqSchema } from './schemas/faq.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ContentResolver } from './content.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faq.name, schema: FaqSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    UsersModule,
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentResolver],
  exports: [ContentService],
})
export class ContentModule {}
