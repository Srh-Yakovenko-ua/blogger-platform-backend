import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { ObjectId, WithId } from 'mongodb';
import { PostType } from '../types/post-types';
import { postsCollections } from '../../../setup/setup-mongo-db';

export const postQueryRepository = {
  async getPosts(filtersQuery: PaginationQueryType): Promise<{
    posts: WithId<PostType>[];
    totalCountPosts: number;
  }> {
    const { pageSize, pageNumber, sortBy, sortDirection } = filtersQuery;
    const skip = (pageNumber - 1) * pageSize;

    const posts = await postsCollections
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCountPosts = await postsCollections.countDocuments();

    return {
      posts: posts,
      totalCountPosts,
    };
  },

  async getPostById(postID: string): Promise<WithId<PostType> | null> {
    const objectId = new ObjectId(postID);

    return postsCollections.findOne({ _id: objectId });
  },

  async getPostsByBlogId(
    blogId: string,
    filters: PaginationQueryType,
  ): Promise<{
    posts: WithId<PostType>[];
    totalCountPosts: number;
  }> {
    const { pageSize, pageNumber, sortBy, sortDirection } = filters;
    const skip = (pageNumber - 1) * pageSize;

    const posts = await postsCollections
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCountPosts = await postsCollections.countDocuments({ blogId });
    return {
      posts: posts,
      totalCountPosts,
    };
  },
};
