import {
  postBlogIdValidation,
  postContentValidation,
  postShortDescriptionValidation,
  postTitleValidation,
} from './validation-post-fields';

export const updatePostDto = [
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation,
];
