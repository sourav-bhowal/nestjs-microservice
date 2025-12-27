import { AuthType } from './auth.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthType;
    }
  }
}
