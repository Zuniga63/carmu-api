import { Request, Response } from 'express';
import UserModel from 'src/models/User.model';
import sendError from 'src/utils/sendError';

export async function list(_req: Request, res: Response) {
  try {
    const users = await UserModel.find().select('-password -remeberToken').sort('name');
    res.status(200).json({ users });
  } catch (error) {
    sendError(error, res);
  }
}
