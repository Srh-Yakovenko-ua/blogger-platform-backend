import { commentsRepository } from '../repository/comments-repository';
import { CommentDBType, CreateCommentDTO, UpdateCommentDTO } from '../types';
import { userQueryService } from '../../users/service/user-query.service';

export const commentsService = {
  async createComments(data: CreateCommentDTO, userID: string): Promise<string> {
    const userInfo = await userQueryService.getUserByID(userID);
    if (!userInfo) throw 'User Not Found';

    const newCommentData: Omit<CommentDBType, 'id'> = {
      content: data.content,
      createdAt: new Date().toISOString(),
      postId: data.postId,
      commentatorInfo: {
        userId: userInfo.id!,
        userLogin: userInfo.login,
      },
    };

    const newCommentInsert = await commentsRepository.createComment(newCommentData);
    return newCommentInsert.insertedId.toString();
  },

  async removeCommentById(commentId: string): Promise<boolean> {
    return await commentsRepository.removeCommentByID(commentId);
  },

  async updateComment(data: UpdateCommentDTO): Promise<boolean> {
    return await commentsRepository.updateComment(data);
  },
};
