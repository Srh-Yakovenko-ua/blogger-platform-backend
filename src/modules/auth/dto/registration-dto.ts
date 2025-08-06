import { body } from 'express-validator';

export const registrationDto = [
  body('login')
    .trim()
    .notEmpty()
    .withMessage('login is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('login must be between 3 and 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('login can contain only letters, numbers, underscores and hyphens'),

  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('password must be between 6 and 20 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .matches(/^[\w\-.]+@([\w-]+\.)+[\w]{2,4}$/)
    .withMessage('Invalid email format'),
];
