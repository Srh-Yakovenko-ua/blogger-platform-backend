import { body, param } from 'express-validator';

export const commentIdValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');

export const commentContentValidation = body('content')
  .exists()
  .withMessage('Content is required')
  .trim()
  .notEmpty()
  .withMessage('Content cannot be empty')
  .isString()
  .withMessage('Content must be a string')
  .isLength({ min: 20, max: 300 })
  .withMessage('Content must be at most 300 characters');
