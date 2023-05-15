import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request...');
  console.log({ ...req });
  console.log('Response...');
  console.log({ ...res });
  next();
}
