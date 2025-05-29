import { ValidationError } from '../types/validation-error';

export const createError = (errors: ValidationError[]): { errorsMessages: ValidationError[] } => {
  return {
    errorsMessages: errors,
  };
};
