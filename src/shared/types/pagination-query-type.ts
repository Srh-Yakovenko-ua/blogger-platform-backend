import { SortDirections } from '../enums/sort-directions';

export type PaginationQueryType = {
  searchNameTerm?: string;
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
};
