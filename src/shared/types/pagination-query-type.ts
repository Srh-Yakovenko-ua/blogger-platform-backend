import { SortDirection } from '../../modules/blogs/enums/blogs-enums';

export type PaginationQueryType = {
  searchNameTerm?: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
