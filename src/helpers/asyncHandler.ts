import { Request, Response, NextFunction } from 'express'

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default (exec: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  return exec(req, res, next).catch(next);
}