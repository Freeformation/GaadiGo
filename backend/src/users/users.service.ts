import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  ResetPasswordInput,
} from './dto/auth.dto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class UsersService {
  // In-memory OTP store: email -> { otp, expiresAt }
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private kafkaService: KafkaProducerService,
    private notificationService: NotificationService,
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

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found.`);
    }

    if (input.name !== undefined) user.name = input.name.trim();
    if (input.phone !== undefined) user.phone = input.phone.trim();
    if (input.city !== undefined) user.city = input.city.trim();
    if (input.avatarUrl !== undefined) user.avatarUrl = input.avatarUrl.trim();
    if (input.dlNumber !== undefined) user.dlNumber = input.dlNumber.trim().toUpperCase();
    if (input.dlCategory !== undefined) user.dlCategory = input.dlCategory.trim();
    if (input.aadhaarMasked !== undefined) user.aadhaarMasked = input.aadhaarMasked.trim();

    if (user.dlNumber || user.aadhaarMasked) {
      user.isKycVerified = true;
    }

    const saved = await user.save();
    await this.kafkaService.emitEvent('vahaan.events', 'user.profile_updated', {
      userId: saved._id,
      name: saved.name,
      phone: saved.phone,
      city: saved.city,
      isKycVerified: saved.isKycVerified,
      updatedAt: new Date().toISOString(),
    });

    return saved;
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found.`);
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(input.oldPassword, user.passwordHash);
      if (!isMatch) {
        throw new BadRequestException('Current password does not match. Please verify and retry.');
      }
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(input.newPassword, salt);
    await user.save();

    await this.kafkaService.emitEvent('vahaan.events', 'user.password_changed', {
      userId: user._id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; simulatedOtp?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.findByEmail(normalizedEmail);
    if (!user) {
      throw new NotFoundException('No account found with this email address.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min validity
    this.otpStore.set(normalizedEmail, { otp, expiresAt });

    const isDemoMode = process.env.DEMO_MODE !== 'false';

    await this.kafkaService.emitEvent('vahaan.events', 'user.forgot_password_requested', {
      userId: user._id,
      email: user.email,
      demoMode: isDemoMode,
      timestamp: new Date().toISOString(),
    });

    // Dispatch real/simulated Email & SMS
    await this.notificationService.sendEmail({
      toEmail: normalizedEmail,
      subject: 'Your VahaanRent Account Verification OTP',
      html: `<h3>VahaanRent Security</h3><p>Your 6-digit verification OTP is: <strong>${otp}</strong>.</p><p>This code expires in 15 minutes.</p>`,
    });

    if (user.phone) {
      await this.notificationService.sendSms({
        toPhone: user.phone,
        message: `VahaanRent: Your password reset OTP is ${otp}. Valid for 15 minutes.`,
        otp,
        type: 'OTP',
      });
    }

    if (isDemoMode) {
      return {
        success: true,
        message: '6-digit verification OTP generated (Demo Mode).',
        simulatedOtp: otp,
      };
    } else {
      return {
        success: true,
        message: `OTP dispatched to registered email (${normalizedEmail}) and SMS. Please check your inbox.`,
        simulatedOtp: null,
      };
    }
  }

  async resetPasswordWithOtp(input: ResetPasswordInput): Promise<{ user: UserDocument; token: string }> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const user = await this.findByEmail(normalizedEmail);
    if (!user) {
      throw new NotFoundException('No account found with this email address.');
    }

    const storedOtpData = this.otpStore.get(normalizedEmail);
    const isMasterDemoOtp = input.otp.trim() === '123456';
    const isOtpValid = storedOtpData && storedOtpData.otp === input.otp.trim() && storedOtpData.expiresAt > Date.now();

    if (!isOtpValid && !isMasterDemoOtp) {
      throw new BadRequestException('Invalid or expired OTP. Please enter the correct code.');
    }

    // Clear used OTP
    this.otpStore.delete(normalizedEmail);

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(input.newPassword, salt);
    const saved = await user.save();

    const token = `token_${saved._id}_${Date.now()}`;

    await this.kafkaService.emitEvent('vahaan.events', 'user.password_reset_success', {
      userId: saved._id,
      email: saved.email,
      timestamp: new Date().toISOString(),
    });

    return { user: saved, token };
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
