import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { SortBy } from '../../../shared/enums/sort-by';
import { SortDirections } from '../../../shared/enums/sort-directions';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;
export const setFiltersQueryForPosts = (req: Partial<PaginationQueryType>) => {
  const { pageSize, pageNumber, sortBy, sortDirection } = req;

  return {
    pageSize: pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE,
    sortBy: sortBy ?? SortBy.createdAt,
    pageNumber: pageNumber ? Number(pageNumber) : DEFAULT_PAGE_NUMBER,
    sortDirection: sortDirection ?? SortDirections.asc,
  };
};
