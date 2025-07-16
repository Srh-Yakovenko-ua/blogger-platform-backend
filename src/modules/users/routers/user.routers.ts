import { Router, Request, Response } from 'express';
import { inputUserDto } from '../dto/input-user-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { userService } from '../service/user.service';
import { CreateUserDTO } from '../types/user-types';
import { createError } from '../../../shared/utils/create-error';
import { HttpStatuses } from '../../../shared/enums/http-statuses';

export const userRouters = Router({});

userRouters.get('/', (req: Request, res: Response) => {});

userRouters.get('/:id', (req: Request, res: Response) => {});

userRouters.post(
  '/',
  inputUserDto,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, CreateUserDTO, {}>, res: Response) => {
    try {
      const newUserID = await userService.createUser(req.body);

      res.send({ id: newUserID }).status(HttpStatuses.Created);
    } catch (err) {
      const errField = err;
      res
        .status(HttpStatuses.BadRequest)
        .send(createError([{ field: `${errField}`, message: `${errField} is already taken` }]));
    }
  },
);

userRouters.delete('/', (req: Request, res: Response) => {});
