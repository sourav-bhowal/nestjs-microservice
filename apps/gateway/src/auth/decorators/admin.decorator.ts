import { SetMetadata } from '@nestjs/common';
import { Role } from '../../types/auth.type';

// Define a constant key to identify admin-only routes
export const REQUIRED_ROLE_KEY = 'requiredRole';

// Create a decorator to mark routes as admin-only
export const AdminOnly = () => SetMetadata(REQUIRED_ROLE_KEY, Role.ADMIN);
