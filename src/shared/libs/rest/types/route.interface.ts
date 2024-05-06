import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './http-method.enum';
import { Middleware } from '../middleware';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
