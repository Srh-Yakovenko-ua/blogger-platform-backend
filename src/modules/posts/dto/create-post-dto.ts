import {
  postBlogIdValidation,
  postContentValidation,
  postShortDescriptionValidation,
  postTitleValidation,
} from './validation-post-fields';

export const createPostDto = [
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation,
];
