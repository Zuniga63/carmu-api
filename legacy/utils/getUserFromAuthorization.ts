import { UserModelHydrated } from 'src/types';
import jwt from 'jsonwebtoken';
import UserModel from 'src/models/User.model';

export default async function getUserFromAuthorization(authorization?: string): Promise<UserModelHydrated | undefined> {
  const message = 'Su sesión expiró.';

  try {
    if (authorization) {
      const [_, token] = authorization.split(' ');
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        if (typeof decode === 'object') {
          const user = await UserModel.findById(decode.id);
          if (user) return user;
        } // .end typeof
      } // .end token
    } // .end authorization
  } catch (error: any) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') error.message = message;
    throw error;
  }

  return undefined;
}
