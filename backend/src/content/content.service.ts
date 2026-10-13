import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq, FaqDocument } from './schemas/faq.schema';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(
    @InjectModel(Faq.name) private faqModel: Model<FaqDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async onModuleInit() {
    await this.seedInitialContent();
  }

  private async seedInitialContent() {
    const faqCount = await this.faqModel.countDocuments();
    if (faqCount === 0) {
      await this.faqModel.insertMany([
        {
          question: 'Can I legally rent out my private scooty or car in India?',
          answer:
            'Under the Motor Vehicles Act 1988, renting vehicles directly requires either a commercial permit ("Rent a Cab" / "Rent a Motorcycle" scheme with yellow or black-yellow plates) OR a compliant peer-to-peer bailee lease agreement under the Indian Contract Act 1872. GaadiGo supports both: certified commercial fleets operate under official transport permits, while private vehicle hosts sign a mutual indemnity bailment deed with renters for community sharing.',
          category: 'LEGAL',
          order: 1,
        },
        {
          question: 'How are traffic challans (e-challans) and FASTag tolls handled?',
          answer:
            'All 4-wheelers must have an active FASTag ID. Toll amounts incurred during the rental trip are automatically calculated and deducted from the refundable security deposit or billed to the renter. For traffic fines issued by traffic police or automated speed cameras during the trip, the renter is 100% legally liable, supported by the timestamped digital handover agreement.',
          category: 'OPERATIONAL',
          order: 2,
        },
        {
          question: 'How and when is the security deposit refunded to the renter?',
          answer:
            'Security deposits (ranging from ₹500 for scooties to ₹5,000 for SUVs) are held in an escrow account. Once the vehicle is returned and the host completes the digital handover checklist without damage or unpaid challans, the deposit is auto-refunded to the renter’s original UPI handle within 2 hours.',
          category: 'FINANCIAL',
          order: 3,
        },
        {
          question: 'What insurance covers the vehicle during a trip?',
          answer:
            'Every listing on GaadiGo must have an active comprehensive insurance policy. Additionally, our platform attaches an on-trip third-party liability cover and 24x7 Roadside Assistance (RSA) across all major national highways and city limits in India.',
          category: 'INSURANCE',
          order: 4,
        },
        {
          question: 'What driving license (DL) is required for scooties and cars?',
          answer:
            'For gearless scooters (e.g. Honda Activa, TVS Jupiter), renters must hold at least an MCWOG (Motorcycle Without Gear) or MCWG endorsement. For geared motorcycles, MCWG is required. For 4-wheelers, an active LMV (Light Motor Vehicle) non-transport license is mandatory. Learners licenses (LL) are not accepted.',
          category: 'COMPLIANCE',
          order: 5,
        },
      ]);
    }

    const reviewCount = await this.reviewModel.countDocuments();
    if (reviewCount === 0) {
      await this.reviewModel.insertMany([
        {
          name: 'Rohit Kulkarni',
          role: 'Honda Activa 6G Host, Indiranagar, Bengaluru',
          quote:
            'My Activa used to sit idle in my apartment parking on weekdays since I work from home. Now I earn around ₹14,000 extra every month on GaadiGo. Payouts arrive every Monday without delay!',
          rating: 5,
          vehicleTitle: 'Honda Activa 6G',
          city: 'Bengaluru',
        },
        {
          name: 'Aakash & Sneha Verma',
          role: 'Rented Thar 4x4 in North Goa',
          quote:
            'The DigiLocker KYC took less than 40 seconds. We picked up a clean Mahindra Thar directly near Calangute beach. No cash hassles, zero haggling, and deposit was back in my GPay account the day we checked out.',
          rating: 5,
          vehicleTitle: 'Mahindra Thar 4x4',
          city: 'Goa',
        },
        {
          name: 'Carlos Fernandes',
          role: 'Fleet Host (RE Hunter & Thar), Goa',
          quote:
            'As a commercial rental operator in Goa, managing bookings and deposit disputes was a headache. GaadiGo streamlined all FASTag toll pass-throughs and KYC verifications seamlessly.',
          rating: 5,
          vehicleTitle: 'Royal Enfield Hunter 350',
          city: 'Goa',
        },
      ]);
    }
  }

  async getFaqs(): Promise<FaqDocument[]> {
    return this.faqModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async getReviews(): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }

  async createFaq(data: Partial<Faq>): Promise<FaqDocument> {
    const faq = new this.faqModel(data);
    return faq.save();
  }

  async createReview(data: Partial<Review>): Promise<ReviewDocument> {
    const review = new this.reviewModel(data);
    return review.save();
  }
}
