import { blogsRepository } from '../repository/blogs-repository';
import { BlogType } from '../types/blog.types';

export const blogService = {
  async createBlog(data: BlogType): Promise<string> {
    const dataWithTimestamp = {
      ...data,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    const newBlog = await blogsRepository.createBlog(dataWithTimestamp);

    return newBlog.insertedId.toString();
  },

  async updateBlog(data: Partial<BlogType>, blogID: string): Promise<boolean> {
    return await blogsRepository.updateBlog(data, blogID);
  },

  async deleteBlog(blogID: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(blogID);
  },
};
