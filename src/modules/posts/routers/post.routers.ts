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
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

import { setFiltersQueryForPosts } from '../utils/set-filters-query-for-posts';

import { blogQueryService } from '../../blogs/service/blog-query-service';
import { postQueryService } from '../service/post-query-service';
import { createPostWithCommentDto } from '../dto/create-post-with-comment-dto';
import { asyncWrapProviders } from 'node:async_hooks';
import { commentsService } from '../../comments/service/comments-service';
import { commentsQueryRepository } from '../../comments/repository/comments-query-repository';
import { commentsQueryService } from '../../comments/service/comments-query-service';
import { postQueryRepository } from '../repository/post-query-repository';

export const postRouters = Router({});

postRouters.get(
  '',
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, {}, Partial<PaginationQueryType>>, res: Response) => {
    const filtersQuery = setFiltersQueryForPosts(req.query);

    const posts = await postQueryService.getPosts(filtersQuery);

    res.status(HttpStatuses.Ok).send(posts);
  },
);

postRouters.get(
  '/:id/comments',
  idValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const filtersQuery = setFiltersQueryForPosts(req.query);

    const findPost = await postQueryRepository.getPostById(req.params.id);

    if (findPost) {
      const comments = await commentsQueryService.getCommentsByPostID({
        filter: filtersQuery,
        postID: req.params.id,
      });
      res.status(HttpStatuses.Ok).send(comments);
    } else {
      res.status(HttpStatuses.NotFound).send(
        createError([
          {
            field: 'postId',
            message: 'Post Not Found',
          },
        ]),
      );
    }
  },
);

postRouters.post(
  '/:id/comments',
  authGuardMiddleware,
  createPostWithCommentDto,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }, {}, { content: string }, {}>, res: Response) => {
    try {
      const newCommentID = await commentsService.createComments(
        {
          content: req.body.content,
          postId: req.params.id,
        },
        req.user?.id!,
      );
      const comment = await commentsQueryService.getCommentByID(newCommentID);

      res.status(HttpStatuses.Created).send(comment);
    } catch (err) {
      res.status(HttpStatuses.NotFound).send(createError([{ field: '', message: `${err}` }]));
    }
  },
);

postRouters.post(
  '',
  authGuardMiddleware,
  createPostDto,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, PostType>, res: Response) => {
    const blog = await blogQueryService.getBlogByID(req.body.blogId);
    if (!blog) {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
      return;
    }

    const payloadData = {
      ...req.body,
      blogName: blog.name,
      blogId: blog.id,
      createdAt: new Date().toISOString(),
    };

    const newPostID = await postService.createPost(payloadData);
    if (newPostID) {
      const post = await postQueryService.getPostById(newPostID);
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
    const findPost = await postQueryService.getPostById(req.params.id);

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
