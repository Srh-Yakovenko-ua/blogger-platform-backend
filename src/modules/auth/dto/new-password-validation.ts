import { body } from 'express-validator';

export const newPasswordValidation = [
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('newPassword is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('newPassword must be between 6 and 20 characters'),

  body('recoveryCode').trim().notEmpty().withMessage('recoveryCode is required'),
];
