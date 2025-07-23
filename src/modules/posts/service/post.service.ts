import { postRepository } from '../repository/post-repository';
import { CreatePostCommentDTO, PostType } from '../types/post-types';
import { jwtService } from '../../../shared/utils/jwt-service';
import { userQueryService } from '../../users/service/user-query.service';
import { postQueryRepository } from '../repository/post-query-repository';

export const postService = {
  async createPost(data: PostType): Promise<string> {
    const newPost = await postRepository.createPost(data);
    return newPost.insertedId.toString();
  },

  async createPostComment(data: CreatePostCommentDTO): Promise<any> {
    const { userId, postId, content } = data;

    const findPost = postQueryRepository.getPostById(postId);
    if (!findPost) {
      throw "Post with specified postId doesn't exists";
    }

    const findUser = await userQueryService.getUserByID(userId);

    return null;
  },

  async updatePost(data: Partial<PostType>, postID: string): Promise<boolean> {
    return await postRepository.updatePost(data, postID);
  },

  async deletePost(postID: string): Promise<boolean> {
    return await postRepository.deletePost(postID);
  },
};
