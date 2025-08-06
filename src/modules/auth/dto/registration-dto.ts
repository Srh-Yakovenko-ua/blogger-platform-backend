import { body } from 'express-validator';

export const registrationDto = [
  body('login').trim().isString().notEmpty().withMessage('Login is required'),

  body('password').trim().isString().notEmpty().withMessage('Password is required'),

  body('email')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
];
