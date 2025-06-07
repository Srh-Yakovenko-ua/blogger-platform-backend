import { postsLocalDb } from '../local-db/posts-local-db';
import { PostType } from '../types/post-types';
import { generateShortId } from '../../../shared/utils/generate-short-id';
import { blogsCollections, postsCollections } from '../../../setup/setup-mongo-db';
import { outputBlogData } from '../../blogs/utils/output-blog-data';
import { outputPostData } from '../utils/output-post-data';
import { Optional } from 'express-validator/lib/context';
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
