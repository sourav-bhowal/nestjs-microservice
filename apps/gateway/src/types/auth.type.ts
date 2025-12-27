export type AuthType = {
  clerkUserId: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
};

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
