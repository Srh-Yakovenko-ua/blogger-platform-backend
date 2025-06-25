import { outputPostData } from '../utils/output-post-data';
import { postRepository } from '../repository/post-repository';
import { PostType } from '../types/post-types';
import { InsertOneResult, ObjectId } from 'mongodb';
import { Nullable } from '../../../shared/types/nullable';
import { postsCollections } from '../../../setup/setup-mongo-db';
import { blogsRepository } from '../../blogs/repository/blogs-repository';

export const postService = {
  async getPosts(): Promise<PostType[]> {
    const blogs = await postRepository.getPosts();
    return blogs.map(outputPostData);
  },

  async getPostById(postID: string): Promise<Nullable<PostType>> {
    const post = await postRepository.getPostById(postID);
    if (post) return outputPostData(post);
    else return null;
  },

  async createPost(data: PostType): Promise<InsertOneResult<PostType>> {
    const dataWithTimestamp = {
      ...data,
      blogName: 'random',
      createdAt: new Date().toISOString(),
    };

    return await postRepository.createPost(dataWithTimestamp);
  },

  async updatePost(data: PostType, postID: string): Promise<boolean> {
    return await postRepository.updatePost(data, postID);
  },

  async deletePost(postID: string): Promise<boolean> {
    return postRepository.deletePost(postID);
  },
};
