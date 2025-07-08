import { SortDirection } from '../enums/blogs-enums';

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type PaginationBlogsMetaType = {
  pageSize: number;
  totalCount: number;
  pagesCount: number;
  page: number;
};

export type InputBlogsQuery = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
