import { SortBy, SortDirection } from '../enums/blogs-enums';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;
export const setFiltersQueryForBlogs = (req: Partial<PaginationQueryType>) => {
  const { searchNameTerm, pageSize, pageNumber, sortBy, sortDirection } = req;

  return {
    searchNameTerm: searchNameTerm ?? '',
    pageSize: pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE,
    sortBy: sortBy ?? SortBy.createdAt,
    pageNumber: pageNumber ? Number(pageNumber) : DEFAULT_PAGE_NUMBER,
    sortDirection: sortDirection ?? SortDirection.asc,
  };
};
