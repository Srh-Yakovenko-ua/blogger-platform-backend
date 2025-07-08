import { WithId } from 'mongodb';
import { BlogType, PaginationBlogsMetaType } from '../types/blog.types';
import { outputBlogData } from './output-blog-data';

export const outputBlogListsWithMetaData = (
  blogs: WithId<BlogType>[],
  meta: PaginationBlogsMetaType,
) => {
  return {
    items: blogs.map(outputBlogData),
    ...meta,
  };
};
