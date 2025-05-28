import {
  descriptionValidationField,
  nameValidationField,
  websiteUrlValidationField,
} from './validation-blog-fields';

export const createBlogDTO = [
  nameValidationField,
  descriptionValidationField,
  websiteUrlValidationField,
];
