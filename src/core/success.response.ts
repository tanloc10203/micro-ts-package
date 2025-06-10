import { Response } from 'express';
import HTTP_REASON from './reason-codes.core';
import HTTP_STATUS from './status-codes.core';

type HttpResponseArgs = {
  message: string;
  status: number;
  metadata?: any;
  options?: any;
};

class HttpResponse {
  public message: string;
  public status: number;
  public metadata: any;
  public options: any;

  constructor({
    message = HTTP_REASON.OK,
    status = HTTP_STATUS.OK,
    metadata = {},
    options = {},
  }: Partial<HttpResponseArgs>) {
    this.message = message;
    this.status = status;
    this.metadata = metadata;
    this.options = options;
  }

  public send(res: Response) {
    return res.status(this.status).json(this);
  }
}

class SuccessResponse extends HttpResponse {
  constructor({ message = 'Successfully', metadata, options }: Partial<HttpResponseArgs>) {
    super({ message, metadata, options });
  }
}

class CreatedResponse extends HttpResponse {
  constructor({
    message = HTTP_REASON.CREATED,
    status = HTTP_STATUS.CREATED,
    metadata = {},
    options = {},
  }: Partial<HttpResponseArgs>) {
    super({ message, status, metadata, options });
  }
}

export { CreatedResponse, SuccessResponse };
