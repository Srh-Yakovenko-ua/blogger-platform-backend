import { CommentDBType, CommentViewModel } from '../types';
import { UserType } from '../../users/types/user-types';
import { WithId } from 'mongodb';

export const outputViewCommentModel = (comment: WithId<CommentDBType>): CommentViewModel => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
};
