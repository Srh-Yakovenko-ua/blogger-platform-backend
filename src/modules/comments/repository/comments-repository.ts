import { commentsCollections } from '../../../setup/setup-mongo-db';
import { CommentDBType, UpdateCommentDTO } from '../types';
import { InsertOneResult, ObjectId } from 'mongodb';

export const commentsRepository = {
  async createComment(data: Omit<CommentDBType, 'id'>): Promise<InsertOneResult<CommentDBType>> {
    return await commentsCollections.insertOne(data as CommentDBType);
  },
  async removeCommentByID(commentID: string): Promise<boolean> {
    const removeComment = await commentsCollections.deleteOne({
      _id: new ObjectId(commentID),
    });

    return removeComment.deletedCount >= 1;
  },

  async updateComment(data: UpdateCommentDTO): Promise<boolean> {
    const { commentId, ...restData } = data;
    const updateCommentResult = await commentsCollections.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { ...restData } },
    );
    return updateCommentResult.matchedCount >= 1;
  },
};
