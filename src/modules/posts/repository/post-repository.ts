import { PostType } from '../types/post-types';
import { postsCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

export const postRepository = {
  async createPost(data: PostType): Promise<InsertOneResult<PostType>> {
    return await postsCollections.insertOne(data);
  },

  async updatePost(data: Partial<PostType>, postID: string): Promise<boolean> {
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
