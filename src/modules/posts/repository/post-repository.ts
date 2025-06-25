import { PostType } from '../types/post-types';
import { postsCollections } from '../../../setup/setup-mongo-db';
import { outputPostData } from '../utils/output-post-data';
import { InsertOneResult, ObjectId, OptionalId, WithId } from 'mongodb';

export const postRepository = {
  async getPosts(): Promise<WithId<PostType>[]> {
    return postsCollections.find().toArray();
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
