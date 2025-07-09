import { SortDirections } from '../enums/sort-directions';

export type PaginationQueryType = {
  searchNameTerm?: string | null;
  sortBy: string;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
};
