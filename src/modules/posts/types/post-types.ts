import { PaginationMetaType } from '../../../shared/types/pagination-meta-type';

export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type OutputPostsType = {
  items: PostType[];
} & PaginationMetaType;

export type InputViewModelPostComment = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
};

export type CreatePostCommentDTO = {
  content: string;
  postId: string;
  userId: string;
};
