import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createBlogDTO } from '../dto/create-blog-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { BlogType } from '../types/blog.types';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { createError } from '../../../shared/utils/create-error';
import { updateBlogDto } from '../dto/update-blog-dto';
import { blogsRepository } from '../repository/blogs-repository';
import { idValidation } from '../dto/validation-blog-fields';

export const blogRouters = Router({});

blogRouters.get('', async (_req, res) => {
  const blogs = await blogsRepository.getBlogs();
  res.status(HttpStatuses.Ok).send(blogs);
});

blogRouters.get(
  '/:id',
  idValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const videoID = req.params.id;

    const findVideo = await blogsRepository.getBlogById(videoID);
    console.log(findVideo, 'video');
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
  async (req: Request<{}, {}, Omit<BlogType, 'id'>>, res: Response) => {
    const newBlog = await blogsRepository.createBlog(req.body);

    if (newBlog) res.status(HttpStatuses.Created).send(newBlog);
  },
);

blogRouters.put(
  '/:id',
  authGuardMiddleware,
  updateBlogDto,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }, {}, Omit<BlogType, 'id'>>, res: Response) => {
    const isUpdateVideo = await blogsRepository.updateBlog(req.body, req.params.id);

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
    const isDelete = await blogsRepository.deleteBlog(req.params.id);

    if (isDelete) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);
