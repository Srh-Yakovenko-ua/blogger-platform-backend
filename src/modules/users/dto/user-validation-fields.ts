import { param } from 'express-validator';

export const mongoIdValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');
