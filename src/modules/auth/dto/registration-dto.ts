import { body } from 'express-validator';

export const registrationDto = [
  body('login').trim().notEmpty().withMessage('Login is required'),

  body('password').trim().notEmpty().withMessage('Password is required'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];
