import { Request, Response, NextFunction } from 'express';
import AuthError from 'src/utils/errors/AuthError';
import getUserFromAuthorization from 'src/utils/getUserFromAuthorization';
import sendError from 'src/utils/sendError';

export default async function userAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { authorization } = req.headers;
  const message = 'Su sesión expiró.';
  try {
    const user = await getUserFromAuthorization(authorization);
    if (!user) throw new AuthError(message);

    req.user = user;
    next();
  } catch (error: any) {
    sendError(error, res);
  }
}

/**
 * Extend Express Request
 * Link: https://stackoverflow.com/questions/65848442/property-user-does-not-exist-on-type-requestparamsdictionary-any-any-pars
 */
