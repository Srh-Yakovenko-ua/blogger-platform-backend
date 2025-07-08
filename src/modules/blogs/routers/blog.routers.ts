import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createBlogDTO } from '../dto/create-blog-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { BlogType, InputBlogsQuery } from '../types/blog.types';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { createError } from '../../../shared/utils/create-error';
import { updateBlogDto } from '../dto/update-blog-dto';
import { idValidation } from '../dto/validation-blog-fields';
import { blogService } from '../service/blog.service';
import { paginationAndSortingValidation } from '../../../shared/validation/pagination-and-sorting-validation';

import { SortBy } from '../enums/blogs-enums';
import { setFiltersQueryForBlogs } from '../utils/set-filters-query-for-blogs';
import { outputBlogListsWithMetaData } from '../utils/output-blog-lists-with-meta-data';

export const blogRouters = Router({});

blogRouters.get(
  '',
  paginationAndSortingValidation(SortBy),
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, {}, Partial<InputBlogsQuery>>, res: Response) => {
    const filtersQuery = setFiltersQueryForBlogs(req.query);

    const { blogs, total } = await blogService.getBlogs(filtersQuery);

    const outputData = outputBlogListsWithMetaData(blogs, {
      totalCount: total,
      pagesCount: Math.ceil(total / filtersQuery.pageSize) || 1,
      page: filtersQuery.pageNumber,
      pageSize: filtersQuery.pageSize,
    });

    res.status(HttpStatuses.Ok).send(outputData);
  },
);

blogRouters.get(
  '/:id',
  idValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const videoID = req.params.id;

    const findVideo = await blogService.getBlogById(videoID);
    if (findVideo) {
      res.status(HttpStatuses.Ok).send(findVideo);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);

blogRouters.post(
  '',
  authGuardMiddleware,
  createBlogDTO,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, BlogType>, res: Response) => {
    const newBlog = await blogService.createBlog(req.body);
    if (newBlog) {
      const blog = await blogService.getBlogById(newBlog.insertedId.toString());
      res.status(HttpStatuses.Created).send(blog);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: '', message: 'Something Went Wrong' }]));
    }
  },
);

blogRouters.put(
  '/:id',
  authGuardMiddleware,
  updateBlogDto,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }, {}, BlogType>, res: Response) => {
    const isUpdateVideo = await blogService.updateBlog(req.body, req.params.id);

    if (isUpdateVideo) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);

blogRouters.delete(
  '/:id',
  idValidation,
  throwValidationErrorsDTO,
  authGuardMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    const isDelete = await blogService.deleteBlog(req.params.id);

    if (isDelete) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);
