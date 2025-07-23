import { idValidation, postContentForCommentsValidation } from './validation-post-fields';

export const createPostWithCommentDto = [idValidation, postContentForCommentsValidation];
