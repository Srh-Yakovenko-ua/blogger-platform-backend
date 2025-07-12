import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

import { OutputPostsType, PostType } from '../types/post-types';
import { outputPostListsWithMetaData } from '../utils/output-post-lists-with-meta-data';
import { Nullable } from '../../../shared/types/nullable';
import { outputPostData } from '../utils/output-post-data';
import { WithId } from 'mongodb';
import { postQueryRepository } from '../repository/post-query-repository';

export const postQueryService = {
  async getPosts(filtersQuery: PaginationQueryType): Promise<OutputPostsType> {
    const { posts, totalCountPosts } = await postQueryRepository.getPosts(filtersQuery);

    return outputPostListsWithMetaData(posts, {
      totalCount: totalCountPosts,
      pagesCount: Math.ceil(totalCountPosts / filtersQuery.pageSize) || 1,
      page: filtersQuery.pageNumber,
      pageSize: filtersQuery.pageSize,
    });
  },

  async getPostById(postID: string): Promise<Nullable<PostType>> {
    const post = await postQueryRepository.getPostById(postID);
    if (post) return outputPostData(post);
    else return null;
  },

  async getPostByBlogId(blogId: string, filters: PaginationQueryType): Promise<OutputPostsType> {
    const { posts, totalCountPosts } = await postQueryRepository.getPostsByBlogId(blogId, filters);

    return {
      items: posts.map(outputPostData),
      totalCount: totalCountPosts,
      pagesCount: Math.ceil(totalCountPosts / filters.pageSize) || 1,
      page: filters.pageNumber,
      pageSize: filters.pageSize,
    };
  },
};
