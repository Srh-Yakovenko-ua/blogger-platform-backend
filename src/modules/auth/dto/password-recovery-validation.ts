import { body } from 'express-validator';

export const passwordRecoveryValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];
