import { body } from 'express-validator';

export const loginValidation = [
  body('loginOrEmail')
    .trim()
    .notEmpty()
    .withMessage('loginOrEmail is required')
    .custom((value) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      const isEmailCandidate = value.match(/@/);

      if (isEmailCandidate && !emailRegex.test(value)) {
        throw new Error('Invalid email format');
      }

      return true;
    }),

  body('password').notEmpty().withMessage('password is required'),
];
