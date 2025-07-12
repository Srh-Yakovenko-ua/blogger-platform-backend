import { PaginationMetaType } from '../../../shared/types/pagination-meta-type';

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type OutputBlogsType = {
  items: BlogType[];
} & PaginationMetaType;
