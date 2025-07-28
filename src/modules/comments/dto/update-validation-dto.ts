import { commentContentValidation, commentIdValidation } from './comments-validation-fields';

export const updateValidationDto = [commentIdValidation, commentContentValidation];
