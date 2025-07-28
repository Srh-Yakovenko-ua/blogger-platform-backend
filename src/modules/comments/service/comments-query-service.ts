import { commentsQueryRepository } from '../repository/comments-query-repository';
import { CommentDBType, CommentViewModel } from '../types';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { userQueryService } from '../../users/service/user-query.service';
import { outputViewCommentModel } from '../utils/output-view-comment-model';

export const commentsQueryService = {
  async getCommentByID(commentID: string): Promise<CommentViewModel | null> {
    const findComment = await commentsQueryRepository.getCommentByID(commentID);
    if (!findComment) return null;
    return outputViewCommentModel(findComment);
  },

  async getCommentsByPostID(data: { filter: PaginationQueryType; postID: string }) {
    const { filter, postID } = data;
    const { comments, totalCountComments } = await commentsQueryRepository.getCommentsByPostID(
      filter,
      postID,
    );

    return {
      totalCount: totalCountComments,
      pagesCount: Math.ceil(totalCountComments / filter.pageSize) || 1,
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      items: comments.map(outputViewCommentModel),
    };
  },
};
