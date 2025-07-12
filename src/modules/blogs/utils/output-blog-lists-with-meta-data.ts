import { WithId } from 'mongodb';
import { BlogType, OutputBlogsType } from '../types/blog.types';
import { outputBlogData } from './output-blog-data';
import { PaginationMetaType } from '../../../shared/types/pagination-meta-type';

export const outputBlogListsWithMetaData = (
  blogs: WithId<BlogType>[],
  meta: PaginationMetaType,
): OutputBlogsType => {
  return {
    items: blogs.map(outputBlogData),
    ...meta,
  };
};
