import { NextFunction, Request, Response } from 'express';

type AsyncHandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * @description Wrap async functions to catch errors
 * @param fn Function to wrap
 * @example
 * const fn = asyncHandler(async (req, res, next) => {
 *   await doSomething();
 *   res.send('Hello World!');
 * });
 *
 * app.get('/', fn);
 * @returns
 */
const asyncHandler = (fn: AsyncHandlerFn) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
