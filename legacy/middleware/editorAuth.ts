import { Request, Response, NextFunction } from 'express';
import AuthError from 'src/utils/errors/AuthError';
import sendError from 'src/utils/sendError';
import getUserFromAuthorization from 'src/utils/getUserFromAuthorization';

export default async function editorAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const message = 'No tienes autorización.';
  const { authorization } = req.headers;

  try {
    const user = await getUserFromAuthorization(authorization);
    if (user && user.role && (user.role === 'admin' || user.role === 'editor')) {
      req.user = user;
      next();
      return;
    }

    throw new AuthError(message);
  } catch (error: any) {
    sendError(error, res);
  }
}
