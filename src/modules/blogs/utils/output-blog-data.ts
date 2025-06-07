import { WithId } from 'mongodb';
import { BlogType } from '../types/blog.types';

export const outputBlogData = (blog: WithId<BlogType>): BlogType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
