export default class AuthError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
    this.name = 'AuthError';
    this.message = message;
  }
}
