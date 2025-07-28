import { postRepository } from '../repository/post-repository';
import { PostType } from '../types/post-types';

export const postService = {
  async createPost(data: PostType): Promise<string> {
    const newPost = await postRepository.createPost(data);
    return newPost.insertedId.toString();
  },

  async updatePost(data: Partial<PostType>, postID: string): Promise<boolean> {
    return await postRepository.updatePost(data, postID);
  },

  async deletePost(postID: string): Promise<boolean> {
    return await postRepository.deletePost(postID);
  },
};
