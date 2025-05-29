import { postsLocalDb } from '../local-db/posts-local-db';
import { PostType } from '../types/post-types';
import { generateShortId } from '../../../shared/utils/generate-short-id';

export const postRepository = {
  getPosts() {
    return postsLocalDb;
  },
  createPost(data: Omit<PostType, 'id'>) {
    const newPost: PostType = {
      id: generateShortId(),
      ...data,
      blogName: 'mock name',
    };

    postsLocalDb.push(newPost);
    return newPost;
  },

  getPostById(postID: string) {
    return postsLocalDb.find((post) => post.id === postID);
  },

  updatePost(data: Omit<PostType, 'id'>, postID: string) {
    const findPost = postsLocalDb.find((post) => post.id === postID);

    if (findPost) {
      Object.assign(findPost, data);
      return findPost;
    } else {
      return null;
    }
  },

  deletePost(postID: string) {
    const index = postsLocalDb.findIndex((blog) => blog.id === postID);
    if (index !== -1) {
      postsLocalDb.splice(index, 1);
      return true;
    } else {
      return null;
    }
  },
};
