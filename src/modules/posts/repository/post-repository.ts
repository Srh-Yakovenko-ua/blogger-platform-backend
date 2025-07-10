import { PostType } from '../types/post-types';
import { postsCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

export const postRepository = {
  async getPosts(filtersQuery: PaginationQueryType): Promise<{
    posts: WithId<PostType>[];
    totalCountPosts: number;
  }> {
    const { pageSize, pageNumber, sortBy, sortDirection } = filtersQuery;
    const skip = (pageNumber - 1) * pageSize;

    const posts = await postsCollections
      .find()
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCountPosts = await postsCollections.countDocuments();

    return {
      posts: posts,
      totalCountPosts,
    };
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
    const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

    const posts = await postsCollections
      .find({ blogId })
      .sort(sortBy, sortDirection)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCountPosts = await postsCollections.countDocuments({ blogId });
    return {
      posts: posts,
      totalCountPosts,
    };
  },

  async createPost(data: PostType): Promise<InsertOneResult<PostType>> {
    return await postsCollections.insertOne(data);
  },

  async getPostById(postID: string): Promise<WithId<PostType> | null> {
    const objectId = new ObjectId(postID);

    return postsCollections.findOne({ _id: objectId });
  },

  async updatePost(data: PostType, postID: string): Promise<boolean> {
    const updatePostResult = await postsCollections.updateOne(
      { _id: new ObjectId(postID) },
      { $set: { ...data } },
    );
    return updatePostResult.matchedCount >= 1;
  },

  async deletePost(postID: string): Promise<boolean> {
    const deleteBlogResult = await postsCollections.deleteOne({
      _id: new ObjectId(postID),
    });
    return deleteBlogResult.deletedCount >= 1;
  },
};
