import { outputBlogData } from '../utils/output-blog-data';
import { blogsRepository } from '../repository/blogs-repository';
import { BlogType } from '../types/blog.types';
import { Nullable } from '../../../shared/types/nullable';

import { InsertOneResult, WithId } from 'mongodb';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
// business logic
export const blogService = {
  async getBlogs(filtersQuery: PaginationQueryType): Promise<{
    blogs: WithId<BlogType>[];
    total: number;
  }> {
    const { blogs, totalCountBlogs } = await blogsRepository.getBlogs(filtersQuery);
    return { blogs: blogs, total: totalCountBlogs };
  },

  async getBlogById(blogID: string): Promise<Nullable<BlogType>> {
    const blog = await blogsRepository.getBlogById(blogID);
    if (blog) return outputBlogData(blog);
    else return null;
  },

  async createBlog(data: BlogType): Promise<InsertOneResult<BlogType>> {
    const dataWithTimestamp = {
      ...data,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return await blogsRepository.createBlog(dataWithTimestamp);
  },

  async updateBlog(data: BlogType, blogID: string): Promise<boolean> {
    return await blogsRepository.updateBlog(data, blogID);
  },

  async deleteBlog(blogID: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(blogID);
  },
};
