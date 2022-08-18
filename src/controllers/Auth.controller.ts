import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from 'src/models/User.model';
import { UserRole, registerBody, UserModelHydrated } from 'src/types';
import sendError from 'src/utils/sendError';
import createToken from 'src/utils';
import InvalidSignInError from 'src/utils/errors/InvalidSignInError';
import ValidationError from 'src/utils/errors/ValidationError';

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