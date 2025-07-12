import { Nullable } from '../../../shared/types/nullable';
import { BlogType, OutputBlogsType } from '../types/blog.types';

import { outputBlogData } from '../utils/output-blog-data';
import { blogQueryRepository } from '../repository/blog-query-repository';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { outputBlogListsWithMetaData } from '../utils/output-blog-lists-with-meta-data';

export const blogQueryService = {
  async getBlogByID(blogID: string): Promise<Nullable<BlogType>> {
    const blog = await blogQueryRepository.getBlogById(blogID);
    if (blog) return outputBlogData(blog);
    else return null;
  },

  async getBlogs(filtersQuery: PaginationQueryType): Promise<OutputBlogsType> {
    const { blogs, totalCountBlogs } = await blogQueryRepository.getBlogs(filtersQuery);

    return outputBlogListsWithMetaData(blogs, {
      totalCount: totalCountBlogs,
      pagesCount: Math.ceil(totalCountBlogs / filtersQuery.pageSize) || 1,
      page: filtersQuery.pageNumber,
      pageSize: filtersQuery.pageSize,
    });
  },
};
