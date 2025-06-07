import { PostType } from '../types/post-types';
import { postsCollections } from '../../../setup/setup-mongo-db';
import { outputPostData } from '../utils/output-post-data';
import { ObjectId, OptionalId } from 'mongodb';

export const postRepository = {
  async getPosts() {
    return postsCollections
      .find()
      .toArray()
      .then((posts) => posts.map(outputPostData));
  },
  async createPost(data: Omit<PostType, 'id'>) {
    const dataWithTimestamp = {
      ...data,
      blogName: 'random',
      createdAt: new Date().toISOString(),
    };
    const newPostInsert = await postsCollections.insertOne(
      dataWithTimestamp as OptionalId<PostType>,
    );

    return await this.getPostById(newPostInsert.insertedId.toString());
  },

  async getPostById(postID: string) {
    const objectId = new ObjectId(postID);

    return postsCollections.findOne({ _id: objectId }).then((post) => {
      if (post) return outputPostData(post);
      else return null;
    });
  },

  async updatePost(data: Omit<PostType, 'id'>, postID: string) {
    const updatePostResult = await postsCollections.updateOne(
      { _id: new ObjectId(postID) },
      { $set: { ...data } },
    );
    return updatePostResult.matchedCount >= 1;
  },

  async deletePost(postID: string) {
    const deleteBlogResult = await postsCollections.deleteOne({
      _id: new ObjectId(postID),
    });
    return deleteBlogResult.deletedCount >= 1;
  },
};
