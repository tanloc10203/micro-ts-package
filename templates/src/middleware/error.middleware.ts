import { HttpException, NotfoundException } from '@/core/error.response';
import HTTP_REASON from '@/core/reason-codes.core';
import HTTP_STATUS from '@/core/status-codes.core';
import { Application, NextFunction, Request, Response } from 'express';

class ErrorMiddleware {
  constructor(private _app: Application) {}

  private catchNotfound = (_req: Request, _res: Response, next: NextFunction) => {
    const error = new NotfoundException({
      message: 'Resource not found!',
    });

    next(error);
  };

  private catchInternalError = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message: string = HTTP_REASON.INTERNAL_SERVER_ERROR;
    let details: any = null;
    let errorCode: string = 'xxx';

    if (error instanceof HttpException) {
      status = error.status;
      message = error.message;
      details = error.details;
      errorCode = error.errorCode;
    }

    const payload = {
      status,
      message,
      details,
      errorCode,
    };

    res.status(status).json(payload);
  };

  public use() {
    this._app.use(this.catchNotfound);
    this._app.use(this.catchInternalError);
  }
}

export default ErrorMiddleware;
