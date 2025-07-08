import { WithId } from 'mongodb';
import { PostType } from '../types/post-types';
import { PaginationMetaType } from '../../../shared/types/pagination-meta-type';
import { outputPostData } from './output-post-data';

export const outputPostListsWithMetaData = (
  posts: WithId<PostType>[],
  meta: PaginationMetaType,
) => {
  return {
    items: posts.map(outputPostData),
    ...meta,
  };
};
