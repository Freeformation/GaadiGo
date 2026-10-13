import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserModel, AuthPayloadModel } from './models/user.model';
import { RegisterInput, LoginInput } from './dto/auth.dto';

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
