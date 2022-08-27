export default class ResponseInfo {
  ok: boolean;

  message?: string;

  error?: any;

  validationErrors?: {};

  warnings: string[];

  constructor(message?: string) {
    this.ok = false;
    this.message = message;
    this.warnings = [];
  }

  addWarning(message: string) {
    this.warnings.push(message);
  }
}
