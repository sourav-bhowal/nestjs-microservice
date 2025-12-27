import { Role } from '../../types/auth.type';

export class CreateUserDto {
  clerkUserId: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  isActive?: boolean;
}
