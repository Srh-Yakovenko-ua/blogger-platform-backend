import { Request, Response, Router } from 'express';
import { inputUserDto } from '../dto/input-user-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { userService } from '../service/user.service';
import { CreateUserDTO, UserPaginationSearchesType } from '../types/user-types';
import { createError } from '../../../shared/utils/create-error';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { mongoIdValidation } from '../dto/user-validation-fields';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

import { userQueryService } from '../service/user-query.service';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { setFiltersForUsers } from '../utils/set-filters-for-users';

export const userRouters = Router({});

userRouters.get(
  '/',
  authGuardMiddleware,
  throwValidationErrorsDTO,
  async (
    req: Request<{}, {}, {}, Partial<PaginationQueryType & UserPaginationSearchesType>>,
    res: Response,
  ) => {
    const filters = setFiltersForUsers(req.query);

    const users = await userQueryService.getUsers(filters);

    res.status(200).send(users);
  },
);

userRouters.post(
  '/',
  inputUserDto,
  authGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, CreateUserDTO, {}>, res: Response) => {
    try {
      const newUserID = await userService.createUser(req.body);

      res.status(HttpStatuses.Created).send({ id: newUserID });
    } catch (err) {
      const errField = err;
      res
        .status(HttpStatuses.BadRequest)
        .send(createError([{ field: `${errField}`, message: `${errField} is already taken` }]));
    }
  },
);

userRouters.get(
  '/:id',
  authGuardMiddleware,
  mongoIdValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const findUser = await userQueryService.getUserByID(req.params.id);
    if (findUser) {
      res.status(HttpStatuses.Ok).send(findUser);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'User not found' }]));
    }
  },
);

userRouters.delete(
  '/:id',
  authGuardMiddleware,
  mongoIdValidation,
  throwValidationErrorsDTO,
  async (req: Request<{ id: string }>, res: Response) => {
    const isDeleteUser = await userService.deleteUser(req.params.id);
    if (isDeleteUser) {
      res.sendStatus(HttpStatuses.NoContent);
    } else {
      res
        .status(HttpStatuses.NotFound)
        .send(createError([{ field: 'id', message: 'User not found' }]));
    }
  },
);
