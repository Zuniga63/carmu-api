export default class ValidationError extends Error {
  errors: object;

  constructor(message: string, errors: object, ...params: any[]) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    this.name = 'ValidationError';
    this.message = message;
    this.errors = errors;
  }
}
