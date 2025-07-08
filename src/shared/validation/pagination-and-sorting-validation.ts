import { query } from 'express-validator';
import { SortDirections } from '../enums/sort-directions';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirections.asc;

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>,
) {
  return [
    query('pageNumber')
      .optional()
      .default(DEFAULT_PAGE)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),

    query('pageSize')
      .optional()
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),

    query('sortBy')
      .optional()
      .default(Object.values(sortFieldsEnum)[0])
      .isIn(Object.values(sortFieldsEnum))
      .withMessage(`Allowed sort fields: ${Object.values(sortFieldsEnum).join(', ')}`),

    query('sortDirection')
      .optional()
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirections))
      .withMessage(`Sort direction must be one of: ${Object.values(SortDirections).join(', ')}`),
  ];
}
