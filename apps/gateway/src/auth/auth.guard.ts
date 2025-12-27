import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { Request } from 'express';
import { User } from '../users/schemas/users.schema';
import { REQUIRED_ROLE_KEY } from './decorators/admin.decorator';
import { Role } from '../types/auth.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // Reflector is used to access metadata set by decorators
    private readonly reflector: Reflector,
    private readonly authService: AuthService, // Inject AuthService
    private readonly userService: UserService, // Inject UserService
  ) {}

  // Main method to determine if a request can proceed
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public using the custom decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Check method-level metadata
      context.getClass(), // Check class-level metadata
    ]);

    // Allow access if the route is public
    if (isPublic) {
      return true;
    }

    // Extract the request object from the context
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // Check if the Authorization header is present
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    // Extract the token from the Authorization header (Bearer token)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // Deny access if no token is present
    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }

    // Variable to hold the existing user from the database
    let existingUserInDb: User | null;

    // Verify the token using AuthService
    try {
      const user = await this.authService.verifyToken(token);

      // Deny access if token is invalid
      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Check if the user exists in the database
      existingUserInDb = await this.userService.findUserByClerkId(
        user.clerkUserId,
      );

      // If user does not exist, create a new user in the database
      if (!existingUserInDb) {
        existingUserInDb = await this.userService.createUser({
          clerkUserId: user.clerkUserId,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        });
      }

      // Attach the user information to the request object for further use
      request.user = existingUserInDb;

      // Check for required role metadata (e.g., admin-only routes)
      const requiredRole = this.reflector.getAllAndOverride<Role>(
        REQUIRED_ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );

      // If a required role is specified, verify the user's role
      if (requiredRole && existingUserInDb.role !== requiredRole) {
        throw new UnauthorizedException(
          'Insufficient permissions to access this resource',
        );
      }

      // Allow access if all checks pass
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired token',
        error instanceof Error ? error : undefined,
      );
    }
  }
}
