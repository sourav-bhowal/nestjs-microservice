import { SetMetadata } from '@nestjs/common';

// Define a constant key to identify public routes
export const IS_PUBLIC_KEY = 'isPublic';

// Create a decorator to mark routes as public
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
