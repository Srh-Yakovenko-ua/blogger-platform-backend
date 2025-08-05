export class AppError extends Error {
  statusCode: number;
  errorsMessages: { message: string; field: string }[];

  constructor(statusCode: number, firstError: { message: string; field: string }) {
    super(firstError.message);
    this.statusCode = statusCode;
    this.errorsMessages = [firstError];

    Error.captureStackTrace(this, this.constructor);
  }
}
