import { Router, Response, Request } from 'express';
import { localBlogsDb } from '../local-db/local-blogs-db';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createBlogDTO } from '../dto/create-blog-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { BlogType } from '../types/blog.types';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { createError } from '../../../shared/utils/create-error';
import { updateBlogDto } from '../dto/update-blog-dto';
import { blogsRepository } from '../repository/blogs-repository';

export const blogRouters = Router({});

blogRouters.get('', (_req, res) => {
  const blogs = blogsRepository.getBlogs();
  res.status(HttpStatuses.Ok).send(blogs);
});

blogRouters.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const videoID = req.params.id;

  const findVideo = blogsRepository.getBlogById(videoID);
  if (findVideo) {
    res.status(HttpStatuses.Ok).send(findVideo);
  } else {
    res
      .status(HttpStatuses.NotFound)
      .send(createError([{ field: 'id', message: 'Blog not found' }]));
  }
});

blogRouters.post(
  '',
  authGuardMiddleware,
  createBlogDTO,
  throwValidationErrorsDTO,
  (req: Request<{}, {}, Omit<BlogType, 'id'>>, res: Response) => {
    const newBlog = blogsRepository.createBlog(req.body);

    res.status(HttpStatuses.Created).send(newBlog);
  },
);

blogRouters.put(
  '/:id',
  authGuardMiddleware,
  updateBlogDto,
  throwValidationErrorsDTO,
  (req: Request<{ id: string }, {}, Omit<BlogType, 'id'>>, res: Response) => {
    const updateVideo = blogsRepository.updateBlog(req.body, req.params.id);

    if (updateVideo) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Blog not found' }]));
    }
  },
);

blogRouters.delete('/:id', authGuardMiddleware, (req: Request<{ id: string }>, res: Response) => {
  const isDelete = blogsRepository.deleteBlog(req.params.id);

  if (isDelete) {
    res.sendStatus(HttpStatuses.NoContent);
  } else {
    res
      .status(HttpStatuses.NotFound)
      .send(createError([{ field: 'id', message: 'Blog not found' }]));
  }
});
