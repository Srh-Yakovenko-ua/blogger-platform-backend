import { validationResult } from 'express-validator';
import { NextFunction, Response, Request, RequestHandler } from 'express';
import { HttpStatuses } from '../enums/http-statuses';
import { createError } from '../utils/create-error';

const formatErrors = (error: any) => {
  return {
    message: error.msg,
    field: error.path,
  };
};

export const throwValidationErrorsDTO: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });
  if (errors.length) {
    res.status(HttpStatuses.BadRequest).send(createError(errors));
    return;
  }

  next();
};
