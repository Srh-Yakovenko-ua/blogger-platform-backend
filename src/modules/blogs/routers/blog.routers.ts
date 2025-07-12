import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createBlogDTO } from '../dto/create-blog-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { BlogType } from '../types/blog.types';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { createError } from '../../../shared/utils/create-error';
import { updateBlogDto } from '../dto/update-blog-dto';
import { idValidation } from '../dto/validation-blog-fields';
import { blogService } from '../service/blog.service';

import { setFiltersQueryForBlogs } from '../utils/set-filters-query-for-blogs';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { blogIdValidation, createPostForBlogDto } from '../dto/create-post-for-blog-dto';
import { postService } from '../../posts/service/post.service';
import { PostType } from '../../posts/types/post-types';
import { setFiltersQueryForPosts } from '../../posts/utils/set-filters-query-for-posts';
import { blogQueryService } from '../service/blog-query-service';
import { postQueryService } from '../../posts/service/post-query-service';

export const blogRouters = Router({});

blogRouters.get(
  '',
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, {}, Partial<PaginationQueryType>>, res: Response) => {
    const filtersQuery = setFiltersQueryForBlogs(req.query);
    const blogs = await blogQueryService.getBlogs(filtersQuery);

    res.status(HttpStatuses.Ok).send(blogs);
  },
);

blogRouters.get(
  '/:id',
  idValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const blogID = req.params.id;

    const findBlog = await blogQueryService.getBlogByID(blogID);
    if (findBlog) {
      res.status(HttpStatuses.Ok).send(findBlog);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);

blogRouters.get(
  '/:blogId/posts',
  blogIdValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ blogId: string }, {}, {}, Partial<PaginationQueryType>>, res: Response) => {
    const blogId = req.params.blogId;
    const filters = setFiltersQueryForPosts(req.query);

    const blog = await blogQueryService.getBlogByID(blogId);
    const postsByBlogId = await postQueryService.getPostByBlogId(blogId, filters);
    if (blog) {
      res.status(HttpStatuses.Ok).send(postsByBlogId);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'blogId', message: 'specificied blog is not exists' }]));
    }
  },
);

blogRouters.post(
  '/:blogId/posts',
  authGuardMiddleware,
  createPostForBlogDto,
  throwValidationErrorsDTO,
  async (req: Request<{ blogId: string }, {}, PostType, {}>, res: Response) => {
    const blogId = req.params.blogId;
    const newPostID = await postService.createPost(req.body);
    const blog = await blogQueryService.getBlogByID(blogId);
    if (!blog) {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
      return;
    }

    try {
      const isUpdate = await postService.updatePost(
        {
          blogId: blog.id,
          blogName: blog.name,
          createdAt: new Date().toISOString(),
        },
        newPostID,
      );
      if (isUpdate) {
        const newPost = await postQueryService.getPostById(newPostID);
        res.status(HttpStatuses.Created).send(newPost);
      }
    } catch (e) {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: '', message: 'Something Went Wrong' }]));
    }
  },
);

blogRouters.post(
  '',
  authGuardMiddleware,
  createBlogDTO,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, BlogType>, res: Response) => {
    const newBlogID = await blogService.createBlog(req.body);
    if (newBlogID) {
      const blog = await blogQueryService.getBlogByID(newBlogID);
      if (!blog) {
        res
          .status(HttpStatuses.NotFound)
          .send(createError([{ field: 'id', message: 'Blog not found' }]));
        return;
      }

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
    const isUpdateBlog = await blogService.updateBlog(req.body, req.params.id);

    if (isUpdateBlog) {
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
