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
import { paginationAndSortingValidation } from '../../../shared/validation/pagination-and-sorting-validation';

import { setFiltersQueryForBlogs } from '../utils/set-filters-query-for-blogs';
import { outputBlogListsWithMetaData } from '../utils/output-blog-lists-with-meta-data';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { SortBy } from '../../../shared/enums/sort-by';
import { blogIdValidation, createPostForBlogDto } from '../dto/create-post-for-blog-dto';
import { postService } from '../../posts/service/post.service';
import { PostType } from '../../posts/types/post-types';
import { setFiltersQueryForPosts } from '../../posts/utils/set-filters-query-for-posts';
import { outputPostData } from '../../posts/utils/output-post-data';

export const blogRouters = Router({});

blogRouters.get(
  '',
  paginationAndSortingValidation(SortBy),
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, {}, Partial<PaginationQueryType>>, res: Response) => {
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
    const blogID = req.params.id;

    const findBlog = await blogService.getBlogById(blogID);
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
  paginationAndSortingValidation(SortBy),
  throwValidationErrorsDTO,
  async (req: Request<{ blogId: string }, {}, {}, Partial<PaginationQueryType>>, res: Response) => {
    const blogId = req.params.blogId;
    const filters = setFiltersQueryForPosts(req.query);

    const { posts, totalCountPosts } = await postService.getPostByBlogId(blogId, filters);
    if (posts.length) {
      res.send({
        items: posts.map(outputPostData),
        totalCount: totalCountPosts,
        pagesCount: Math.ceil(totalCountPosts / filters.pageSize) || 1,
        page: filters.pageNumber,
        pageSize: filters.pageSize,
      });
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
    const postInsert = await postService.createPost(req.body);
    const blog = await blogService.getBlogById(blogId);
    if (!blog) {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
      return;
    }
    const post = postInsert
      ? await postService.getPostById(postInsert.insertedId.toString())
      : null;
    if (post && blog) {
      const isUpdate = await postService.updatePost(
        {
          ...post,
          blogId: blog.id,
          blogName: blog.name,
        },
        post.id,
      );
      if (isUpdate) {
        const newPost = await postService.getPostById(post?.id);
        res.status(HttpStatuses.Created).send(newPost);
      }
    } else {
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
