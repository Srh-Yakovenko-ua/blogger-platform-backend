import { body } from 'express-validator';

export const registrationEmailResendingDto = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];
