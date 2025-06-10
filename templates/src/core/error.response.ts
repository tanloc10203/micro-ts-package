import HTTP_REASON from './reason-codes.core';
import HTTP_STATUS from './status-codes.core';

type HttpExceptionArgs = {
  status: number;
  message: string;
  details?: any;
  errorCode?: string;
};

class HttpException extends Error {
  public status: number;
  public details: any;
  public errorCode: string;

  constructor({ message, status, errorCode = 'xxx', details }: HttpExceptionArgs) {
    super(message);

    this.status = status;
    this.details = details;
    this.errorCode = errorCode;
  }
}

class ConflictException extends HttpException {
  constructor({
    message = HTTP_REASON.CONFLICT,
    status = HTTP_STATUS.CONFLICT,
    details = null,
    errorCode = 'xxx',
  }: Partial<HttpExceptionArgs>) {
    super({ message, status, details, errorCode });
  }
}

class BadRequestException extends HttpException {
  constructor({
    message = HTTP_REASON.BAD_REQUEST,
    status = HTTP_STATUS.BAD_REQUEST,
    details = null,
    errorCode = 'xxx',
  }: Partial<HttpExceptionArgs>) {
    super({ message, status, details, errorCode });
  }
}

class NotfoundException extends HttpException {
  constructor({
    message = HTTP_REASON.NOT_FOUND,
    status = HTTP_STATUS.NOT_FOUND,
    details = null,
    errorCode = 'xxx',
  }: Partial<HttpExceptionArgs>) {
    super({ message, status, details, errorCode });
  }
}

class UnauthorizedException extends HttpException {
  constructor({
    message = HTTP_REASON.UNAUTHORIZED,
    status = HTTP_STATUS.UNAUTHORIZED,
    details = null,
    errorCode = 'xxx',
  }: Partial<HttpExceptionArgs>) {
    super({ message, status, details, errorCode });
  }
}

class ForbiddenException extends HttpException {
  constructor({
    message = HTTP_REASON.FORBIDDEN,
    status = HTTP_STATUS.FORBIDDEN,
    details = null,
    errorCode = 'xxx',
  }: Partial<HttpExceptionArgs>) {
    super({ message, status, details, errorCode });
  }
}

export {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotfoundException,
  UnauthorizedException,
  HttpException,
};
