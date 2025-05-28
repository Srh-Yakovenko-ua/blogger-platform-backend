import { ValidationError } from '../types/validation-error';

export const createError = (errors: ValidationError[]): { errorMessages: ValidationError[] } => {
  return {
    errorMessages: errors,
  };
};
