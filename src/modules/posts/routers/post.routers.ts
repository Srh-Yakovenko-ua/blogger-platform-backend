import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { createPostDto } from '../dto/create-post-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { PostType } from '../types/post-types';
import { createError } from '../../../shared/utils/create-error';
import { updatePostDto } from '../dto/update-post-dto';
import { idValidation } from '../dto/validation-post-fields';
import { postService } from '../service/post.service';
import { paginationAndSortingValidation } from '../../../shared/validation/pagination-and-sorting-validation';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { SortBy } from '../../../shared/enums/sort-by';
import { outputPostListsWithMetaData } from '../utils/output-post-lists-with-meta-data';
import { setFiltersQueryForPosts } from '../utils/set-filters-query-for-posts';

export const postRouters = Router({});

postRouters.get(
  '',
  // paginationAndSortingValidation(SortBy),
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, {}, Partial<PaginationQueryType>>, res: Response) => {
    const filtersQuery = setFiltersQueryForPosts(req.query);

    console.log(filtersQuery);
    const { posts, total } = await postService.getPosts(filtersQuery);

    const outputData = outputPostListsWithMetaData(posts, {
      totalCount: total,
      pagesCount: Math.ceil(total / filtersQuery.pageSize) || 1,
      page: filtersQuery.pageNumber,
      pageSize: filtersQuery.pageSize,
    });

    res.status(HttpStatuses.Ok).send(outputData);
  },
);

postRouters.post(
  '',
  authGuardMiddleware,
  createPostDto,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, PostType>, res: Response) => {
    const newPostInsert = await postService.createPost(req.body);
    if (newPostInsert) {
      const post = await postService.getPostById(newPostInsert.insertedId.toString());
      res.status(HttpStatuses.Created).send(post);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: '', message: 'Something Went Wrong' }]));
    }
  },
);

postRouters.get(
  '/:id',
  idValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const findPost = await postService.getPostById(req.params.id);

    if (findPost) {
      res.status(HttpStatuses.Ok).send(findPost);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Post not found' }]));
    }
  },
);

postRouters.put(
  '/:id',
  authGuardMiddleware,
  updatePostDto,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }, {}, PostType>, res: Response) => {
    const isUpdatePost = await postService.updatePost(req.body, req.params.id);
    if (isUpdatePost) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Post not found' }]));
    }
  },
);

postRouters.delete(
  '/:id',
  idValidation,
  throwValidationErrorsDTO,
  authGuardMiddleware,
  async (req: Request, res: Response) => {
    const isDelete = await postService.deletePost(req.params.id);

    if (isDelete) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);
