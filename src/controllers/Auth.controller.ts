import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from 'src/models/User.model';
import { UserRole, registerBody, UserModelHydrated } from 'src/types';
import sendError from 'src/utils/sendError';
import { createToken } from 'src/utils';
import InvalidSignInError from 'src/utils/errors/InvalidSignInError';
import ValidationError from 'src/utils/errors/ValidationError';
import NotFoundError from 'src/utils/errors/NotFoundError';

const getPublicUserData = (user: UserModelHydrated) => ({
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  role: user.role,
});

export async function signup(req: Request, res: Response): Promise<void> {
  const { name, email, password, confirmPassword }: registerBody = req.body;

  try {
    const userCount = await UserModel.count();
    const role: UserRole = userCount ? 'user' : 'admin';

    if (password !== confirmPassword) {
      throw new ValidationError('Las constraseñas con coinciden', {
        confirmPassword: {
          name: 'ValidationError',
          message: 'Las contraseñas no coinciden',
          path: 'confirmPassword',
          value: '',
        },
      });
    }

    const user = await UserModel.create({ name, email, password, role });
    const token = createToken({ id: user.id });
    const userData = getPublicUserData(user);

    res.status(201).json({ ok: true, token, user: userData });
  } catch (error) {
    sendError(error, res);
  }
}

export async function signin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const message: string = 'Correo o contraseña invalidos.';

    const user: UserModelHydrated | null = await UserModel.findOne({ email });
    if (!user) throw new InvalidSignInError(message);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new InvalidSignInError(message);

    const token = createToken({ id: user.id });

    const userData = getPublicUserData(user);

    res.status(200).json({ ok: true, token, user: userData });
  } catch (error) {
    sendError(error, res);
  }
}

export async function isAuthenticated(req: Request, res: Response): Promise<void> {
  const { user } = req;
  if (user) {
    res.status(200).json({ ok: true, user: getPublicUserData(user) });
  } else {
    res.status(401).json({ ok: false });
  }
}

export async function updatePassword(req: Request, res: Response): Promise<void> {
  const { user } = req;
  const { password, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      throw new ValidationError('Las constraseñas con coinciden', {
        confirmPassword: {
          name: 'ValidationError',
          message: 'Las contraseñas no coinciden',
          path: 'confirmPassword',
          value: '',
        },
      });
    }

    if (!user) throw new NotFoundError('Usuario no encontrado');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new InvalidSignInError('Contraseña incorrecta.');

    user.password = newPassword;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ ok: true });
  } catch (error) {
    sendError(error, res);
  }
}
