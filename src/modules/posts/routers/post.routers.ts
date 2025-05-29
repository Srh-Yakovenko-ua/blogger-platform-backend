import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { createPostDto } from '../dto/create-post-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { postRepository } from '../repository/post-repository';
import { PostType } from '../types/post-types';
import { createError } from '../../../shared/utils/create-error';
import { updatePostDto } from '../dto/update-post-dto';

export const postRouters = Router({});

postRouters.get('', (_req: Request, res: Response) => {
  res.status(HttpStatuses.Ok).send(postRepository.getPosts());
});

postRouters.post(
  '',
  authGuardMiddleware,
  createPostDto,
  throwValidationErrorsDTO,
  (req: Request<{}, {}, Omit<PostType, 'id'>>, res: Response) => {
    res.status(HttpStatuses.Created).send(postRepository.createPost(req.body));
  },
);

postRouters.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const findPost = postRepository.getPostById(req.params.id);

  if (findPost) {
    res.status(HttpStatuses.Ok).send(findPost);
  } else {
    res
      .status(HttpStatuses.NotFound)
      .send(createError([{ field: 'id', message: 'Post not found' }]));
  }
});

postRouters.put(
  '/:id',
  authGuardMiddleware,
  updatePostDto,
  throwValidationErrorsDTO,
  (req: Request<{ id: string }, {}, Omit<PostType, 'id'>>, res: Response) => {
    const updatePost = postRepository.updatePost(req.body, req.params.id);
    if (updatePost) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'Post not found' }]));
    }
  },
);

postRouters.delete('/:id', authGuardMiddleware, (req: Request, res: Response) => {
  const isDelete = postRepository.deletePost(req.params.id);

  if (isDelete) {
    res.sendStatus(HttpStatuses.NoContent);
  } else {
    res
      .status(HttpStatuses.NotFound)
      .send(createError([{ field: 'id', message: 'Blog not found' }]));
  }
});
