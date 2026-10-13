import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterInput, LoginInput } from './dto/auth.dto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private kafkaService: KafkaProducerService,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async register(input: RegisterInput): Promise<{ user: UserDocument; token: string }> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new BadRequestException('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const newUser = new this.userModel({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash,
      role: input.role || 'RENTER',
      city: input.city || 'Bengaluru',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name)}`,
      isKycVerified: false,
    });

    const saved = await newUser.save();
    const token = `token_${saved._id}_${Date.now()}`;

    // Emit Kafka domain event
    await this.kafkaService.emitEvent('vahaan.events', 'user.registered', {
      userId: saved._id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
      city: saved.city,
    });

    return { user: saved, token };
  }

  async login(input: LoginInput): Promise<{ user: UserDocument; token: string }> {
    const user = await this.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(input.password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password.');
      }
    }

    const token = `token_${user._id}_${Date.now()}`;

    await this.kafkaService.emitEvent('vahaan.events', 'user.logged_in', {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
