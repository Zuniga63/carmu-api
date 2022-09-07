export default class CashboxError extends Error {
  constructor(message: string, ...params: any[]) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CashboxError);
    }
    this.name = 'CashboxError';
    this.message = message;
  }
}
