import { HttpStatuses } from '../enums/http-statuses';

type ExtensionType = {
  field: string;
  message: string;
};

export type Result<T = null> = {
  status: HttpStatuses;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
export class ResultFactory {
  static success<T>({
    data,
    status = HttpStatuses.Ok,
    extensions = [],
  }: {
    data: T;
    status: HttpStatuses;
    extensions: ExtensionType[];
  }): Result<T> {
    return {
      status,
      data,
      extensions,
    };
  }

  static fail<T = null>(
    status: HttpStatuses,
    errorMessage: string,
    extensions: ExtensionType[] = [],
  ): Result<T> {
    return {
      status,
      errorMessage,
      extensions,
      data: null as T,
    };
  }

  static notFound({ message = 'Not Found', field }: { message: string; field: string }): Result {
    return this.fail(HttpStatuses.NotFound, message, [{ field, message }]);
  }
  static noContent(): Result<null> {
    return {
      status: HttpStatuses.NoContent,
      data: null,
      extensions: [],
    };
  }
  static unauthorized({ message, field }: { message: string; field: string }): Result {
    return this.fail(HttpStatuses.Unauthorized, message, [{ field, message }]);
  }
  static badRequest({ field, message }: { field: string; message: string }): Result {
    return this.fail(HttpStatuses.BadRequest, 'Bad Request', [{ field, message }]);
  }
}
