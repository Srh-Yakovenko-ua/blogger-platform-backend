import { InputBlogsQuery } from '../types/blog.types';
import { SortBy, SortDirection } from '../enums/blogs-enums';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;
export const setFiltersQueryForBlogs = (req: Partial<InputBlogsQuery>) => {
  const { searchNameTerm, pageSize, pageNumber, sortBy, sortDirection } = req;

  return {
    searchNameTerm: searchNameTerm ?? '',
    pageSize: pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE,
    sortBy: sortBy ?? SortBy.createdAt,
    pageNumber: pageNumber ? Number(pageNumber) : DEFAULT_PAGE_NUMBER,
    sortDirection: sortDirection ?? SortDirection.asc,
  };
};
