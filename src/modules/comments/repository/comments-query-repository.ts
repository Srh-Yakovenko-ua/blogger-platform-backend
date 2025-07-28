import { ObjectId, WithId } from 'mongodb';
import {
  blogsCollections,
  commentsCollections,
  postsCollections,
} from '../../../setup/setup-mongo-db';
import { CommentDBType } from '../types';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

export const commentsQueryRepository = {
  async getCommentByID(commentID: string): Promise<WithId<CommentDBType> | null> {
    const objectID = new ObjectId(commentID);

    return await commentsCollections.findOne({ _id: objectID });
  },

  async getCommentsByPostID(filter: PaginationQueryType, postID: string) {
    const { pageSize, pageNumber, sortDirection, sortBy } = filter;

    const skip = (pageNumber - 1) * pageSize;

    const comments = await commentsCollections
      .find({ postId: postID })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCountComments = await commentsCollections.countDocuments({ postId: postID });
    return { comments, totalCountComments };
  },
};
