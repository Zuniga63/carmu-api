import { Request, Response, NextFunction } from 'express';
// import UserModel from 'src/models/User.model';
import AuthError from 'src/utils/errors/AuthError';
import sendError from 'src/utils/sendError';
import getUserFromAuthorization from 'src/utils/getUserFromAuthorization';

export default async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const message = 'No tienes autorización.';
  const { authorization } = req.headers;

  try {
    const user = await getUserFromAuthorization(authorization);
    if (!user || (user && user.role && user.role !== 'admin')) throw new AuthError(message);

    req.user = user;
    console.log('Paso el midleware de admin');
    next();
  } catch (error: any) {
    sendError(error, res);
  }
}
