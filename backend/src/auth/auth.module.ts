import { Module, Global } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class AuthModule {}
