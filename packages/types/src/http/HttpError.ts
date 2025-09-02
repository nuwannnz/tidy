import { HttpStatus } from './http.js';

export class HttpError extends Error {
  private readonly _statusCode: HttpStatus;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super();
    this.message = message;
    this._statusCode = statusCode;
  }

  public get statusCode() {
    return this._statusCode;
  }
}
