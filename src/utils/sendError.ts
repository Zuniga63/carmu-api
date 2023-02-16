import { Response } from 'express';
import ResponseInfo from './ResponseInfo';

export default function sendError(error: any, res: Response) {
  const { name: errorName, message }: { name: string; message: string } = error;
  let code: number = 500;
  const info = new ResponseInfo(message);

  switch (errorName) {
    case 'CashboxError':
    case 'BadRequest':
    case 'InvalidSignInError':
      code = 400;
      break;
    case 'ValidationError':
      info.message = 'Error de validación';
      info.validationErrors = error.errors;
      code = 422;
      break;
    case 'TokenExpiredError':
    case 'JsonWebTokenError':
    case 'AuthError':
      code = 401;
      break;
    case 'NotFoundError':
      code = 404;
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(error);
      break;
  }

  res.status(code).json(info);
}
