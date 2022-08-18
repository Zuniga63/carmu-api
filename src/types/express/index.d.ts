import { UserModelHydrated } from 'src/types';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserModelHydrated;
    }
  }
}
