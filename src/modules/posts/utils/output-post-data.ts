import { WithId } from 'mongodb';
import { PostType } from '../types/post-types';

export const outputPostData = (post: WithId<PostType>): PostType => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
