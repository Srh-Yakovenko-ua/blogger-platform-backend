import { Router, Request, Response } from 'express';
import { commentsQueryService } from '../service/comments-query-service';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { commentsService } from '../service/comments-service';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { commentIdValidation } from '../dto/comments-validation-fields';
import { updateValidationDto } from '../dto/update-validation-dto';

export const commentsRouters = Router({});

commentsRouters.get(
  '/:id',
  commentIdValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const findComment = await commentsQueryService.getCommentByID(req.params.id);

    if (findComment) {
      res.status(HttpStatuses.Ok).send(findComment);
    } else {
      res.status(HttpStatuses.NotFound).send(
        createError([
          {
            field: 'commentId',
            message: 'Comment Not Found',
          },
        ]),
      );
    }
  },
);

commentsRouters.put(
  '/:id',
  authGuardMiddleware,
  updateValidationDto,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }, {}, { content: string }>, res: Response) => {
    const isUpdate = await commentsService.updateComment({
      commentId: req.params.id,
      content: req.body.content,
    });
    if (isUpdate) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res.status(HttpStatuses.NotFound).send(
        createError([
          {
            field: 'commentId',
            message: 'Comment Not Found',
          },
        ]),
      );
    }
  },
);

commentsRouters.delete(
  '/:id',
  commentIdValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const isDelete = await commentsService.removeCommentById(req.params.id);
    if (isDelete) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res.status(HttpStatuses.NotFound).send(
        createError([
          {
            field: 'commentId',
            message: 'Comment not Found',
          },
        ]),
      );
    }
  },
);
