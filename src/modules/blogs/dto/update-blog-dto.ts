import {
  descriptionValidationField,
  nameValidationField,
  websiteUrlValidationField,
} from './validation-blog-fields';

export const updateBlogDto = [
  nameValidationField,
  descriptionValidationField,
  websiteUrlValidationField,
];
