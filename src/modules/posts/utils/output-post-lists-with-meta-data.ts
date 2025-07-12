import { WithId } from 'mongodb';
import { OutputPostsType, PostType } from '../types/post-types';
import { PaginationMetaType } from '../../../shared/types/pagination-meta-type';
import { outputPostData } from './output-post-data';

export const outputPostListsWithMetaData = (
  posts: WithId<PostType>[],
  meta: PaginationMetaType,
): OutputPostsType => {
  return {
    items: posts.map(outputPostData),
    ...meta,
  };
};
