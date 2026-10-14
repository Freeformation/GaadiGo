import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserModel, AuthPayloadModel, ForgotPasswordPayloadModel } from './models/user.model';
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './dto/auth.dto';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel], { name: 'getUsers' })
  async getUsers(): Promise<UserModel[]> {
    const docs = await this.usersService.findAll();
    return docs.map((d) => this.mapToModel(d));
  }

  @Query(() => UserModel, { name: 'getUserByPhone', nullable: true })
  async getUserByPhone(@Args('phone') phone: string): Promise<UserModel | null> {
    const d = await this.usersService.findByPhone(phone);
    if (!d) return null;
    return this.mapToModel(d);
  }

  @Query(() => UserModel, { name: 'getUserByEmail', nullable: true })
  async getUserByEmail(@Args('email') email: string): Promise<UserModel | null> {
    const d = await this.usersService.findByEmail(email);
    if (!d) return null;
    return this.mapToModel(d);
  }

  @Mutation(() => AuthPayloadModel)
  async registerUser(@Args('input') input: RegisterInput): Promise<AuthPayloadModel> {
    const { user, token } = await this.usersService.register(input);
    return {
      token,
      user: this.mapToModel(user),
    };
  }

  @Mutation(() => AuthPayloadModel)
  async loginUser(@Args('input') input: LoginInput): Promise<AuthPayloadModel> {
    const { user, token } = await this.usersService.login(input);
    return {
      token,
      user: this.mapToModel(user),
    };
  }

  @Mutation(() => UserModel)
  async updateUserProfile(
    @Args('userId') userId: string,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UserModel> {
    const updated = await this.usersService.updateProfile(userId, input);
    return this.mapToModel(updated);
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Args('userId') userId: string,
    @Args('input') input: ChangePasswordInput,
  ): Promise<boolean> {
    return this.usersService.changePassword(userId, input);
  }

  @Mutation(() => ForgotPasswordPayloadModel)
  async requestPasswordReset(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<ForgotPasswordPayloadModel> {
    return this.usersService.requestPasswordReset(input.email);
  }

  @Mutation(() => AuthPayloadModel)
  async resetPasswordWithOtp(
    @Args('input') input: ResetPasswordInput,
  ): Promise<AuthPayloadModel> {
    const { user, token } = await this.usersService.resetPasswordWithOtp(input);
    return {
      token,
      user: this.mapToModel(user),
    };
  }

  private mapToModel(d: any): UserModel {
    return {
      id: d._id.toString(),
      name: d.name,
      email: d.email,
      phone: d.phone || '',
      avatarUrl: d.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(d.name)}`,
      role: d.role,
      isKycVerified: d.isKycVerified,
      dlNumber: d.dlNumber,
      dlCategory: d.dlCategory,
      aadhaarMasked: d.aadhaarMasked,
      city: d.city,
      createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
    };
  }
}
