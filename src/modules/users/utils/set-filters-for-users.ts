import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { SortBy } from '../../../shared/enums/sort-by';
import { SortDirections } from '../../../shared/enums/sort-directions';
import { UserPaginationSearchesType } from '../types/user-types';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;
export const setFiltersForUsers = (
  filterQueryParams: Partial<PaginationQueryType & UserPaginationSearchesType>,
): PaginationQueryType & UserPaginationSearchesType => {
  const { pageSize, searchEmailTerm, searchLoginTerm, pageNumber, sortBy, sortDirection } =
    filterQueryParams;
  return {
    pageSize: pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE,
    sortBy: sortBy ?? SortBy.createdAt,
    pageNumber: pageNumber ? Number(pageNumber) : DEFAULT_PAGE_NUMBER,
    sortDirection: sortDirection ?? SortDirections.desc,
    searchEmailTerm: searchEmailTerm ? searchEmailTerm : null,
    searchLoginTerm: searchLoginTerm ? searchLoginTerm : null,
  };
};
