import { FieldValidationError, Result, validationResult } from 'express-validator';
import { NextFunction, Response, Request, RequestHandler } from 'express';
import { HttpStatuses } from '../enums/http-statuses';
import { createError } from '../utils/create-error';
import { blogRouters } from '../../modules/blogs/routers/blog.routers';

const formatErrors = (error: any) => {
  return {
    field: error.path,
    message: error.msg,
  };
};

export const throwValidationErrorsDTO: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });
  console.log(errors);
  if (errors.length) {
    res.status(HttpStatuses.BadRequest).send(createError(errors));
    return;
  }

  next();
};
