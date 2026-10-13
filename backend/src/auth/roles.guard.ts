import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, route is open
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Extract request object for either REST or GraphQL
    let req: any;
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      req = gqlContext.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
    let token = '';

    if (authHeader && typeof authHeader === 'string') {
      token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    } else if (req?.query?.token) {
      token = req.query.token as string;
    }

    if (!token) {
      throw new UnauthorizedException('Authentication token required to perform this action.');
    }

    // Parse token format: token_<userId>_<timestamp>
    let user = null;
    const parts = token.split('_');
    if (parts.length >= 3 && parts[0] === 'token') {
      const userId = parts[1];
      user = await this.usersService.findById(userId);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired authentication session. Please sign in again.');
    }

    // Attach user to request for downstream controller handlers
    req.user = user;

    // Check role authorization
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Action requires role [${requiredRoles.join(' or ')}]. Your current role is '${user.role}'.`
      );
    }

    return true;
  }
}
