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
