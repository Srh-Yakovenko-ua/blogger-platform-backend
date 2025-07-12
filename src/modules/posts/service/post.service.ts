import { outputPostData } from '../utils/output-post-data';
import { postRepository } from '../repository/post-repository';
import { PostType } from '../types/post-types';
import { InsertOneResult, WithId } from 'mongodb';
import { Nullable } from '../../../shared/types/nullable';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

export const postService = {
  async getPosts(filtersQuery: PaginationQueryType): Promise<{
    posts: WithId<PostType>[];
    total: number;
  }> {
    const { posts, totalCountPosts } = await postRepository.getPosts(filtersQuery);
    return { posts, total: totalCountPosts };
  },

  async getPostById(postID: string): Promise<Nullable<PostType>> {
    const post = await postRepository.getPostById(postID);
    if (post) return outputPostData(post);
    else return null;
  },

  async getPostByBlogId(
    blogId: string,
    filters: PaginationQueryType,
  ): Promise<{
    posts: WithId<PostType>[];
    totalCountPosts: number;
  }> {
    return await postRepository.getPostsByBlogId(blogId, filters);
  },

  async createPost(data: PostType): Promise<InsertOneResult<PostType>> {
    return await postRepository.createPost(data);
  },

  async updatePost(data: PostType, postID: string): Promise<boolean> {
    return await postRepository.updatePost(data, postID);
  },

  async deletePost(postID: string): Promise<boolean> {
    return await postRepository.deletePost(postID);
  },
};
