import {
  descriptionValidationField,
  idValidation,
  nameValidationField,
  websiteUrlValidationField,
} from './validation-blog-fields';

export const updateBlogDto = [
  idValidation,
  nameValidationField,
  descriptionValidationField,
  websiteUrlValidationField,
];
