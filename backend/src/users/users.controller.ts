import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterInput, LoginInput } from './dto/auth.dto';

@Controller('api/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() input: RegisterInput) {
    return this.usersService.register(input);
  }

  @Post('login')
  async login(@Body() input: LoginInput) {
    return this.usersService.login(input);
  }

  @Get('users')
  async getUsers() {
    return this.usersService.findAll();
  }
}
