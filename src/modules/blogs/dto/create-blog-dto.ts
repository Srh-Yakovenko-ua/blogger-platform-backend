import {
  descriptionValidationField,
  idValidation,
  nameValidationField,
  websiteUrlValidationField,
} from './validation-blog-fields';

export const createBlogDTO = [
  nameValidationField,
  descriptionValidationField,
  websiteUrlValidationField,
];
