import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/content')
@UseGuards(RolesGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('faqs')
  async getFaqs() {
    return this.contentService.getFaqs();
  }

  @Get('reviews')
  async getReviews() {
    return this.contentService.getReviews();
  }

  @Post('faqs')
  @Roles('ADMIN')
  async createFaq(@Body() body: any) {
    return this.contentService.createFaq(body);
  }

  @Post('reviews')
  @Roles('ADMIN', 'RENTER')
  async createReview(@Body() body: any) {
    return this.contentService.createReview(body);
  }
}
