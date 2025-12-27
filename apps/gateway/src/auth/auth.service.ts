import { createClerkClient, verifyToken } from '@clerk/backend';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthType, Role } from '../types/auth.type';

@Injectable()
export class AuthService {
  // Clerk API Keys from environment variables
  private readonly clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  private readonly clerkSecretKey = process.env.CLERK_SECRET_KEY;

  // Initialize Clerk client (private to prevent external access, readonly for immutability i.e. cannot be changed after initialization)
  private readonly clerk = createClerkClient({
    secretKey: this.clerkSecretKey,
    publishableKey: this.clerkPublishableKey,
  });

  // Method to verify a session token using Clerk
  async verifyToken(token: string): Promise<AuthType | undefined> {
    try {
      // Verify the token using Clerk's verifyToken function
      const payload = await verifyToken(token, {
        secretKey: this.clerkSecretKey,
      });

      // Extract the user ID from the token payload
      const clerkUserId = payload.sub;

      if (!clerkUserId) {
        throw new UnauthorizedException('Invalid token: No user ID found');
      }

      // Determine user role, defaulting to USER if not ADMIN or USER
      const role = [Role.ADMIN, Role.USER].includes(payload.role as Role)
        ? (payload.role as Role)
        : Role.USER;

      // If name and email are present in the payload, return them directly
      if (payload.name && payload.email) {
        return {
          clerkUserId,
          email: payload.email as string,
          name: payload.name as string,
          role,
          isActive: (payload.isActive as boolean) || true,
        };
      }

      // Fetch user details from Clerk using the user ID
      const user = await this.clerk.users.getUser(clerkUserId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName + ' ' + user.lastName,
        role,
        isActive: true,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
    }
  }
}
