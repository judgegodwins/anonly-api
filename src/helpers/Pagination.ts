import { Query, Document } from "mongoose";
import { Request, Response } from 'express';
import { MessageModel } from "../database/models/Message";

export interface PaginationResult {
  data: any;
  pagesNecessary: number;
  next?: {
    page: number;
    limit: number;
  }
  previous?: {
    page: number;
    limit: number;
  }
}

export type PaginationFunction = <RequestType extends Request>(req: RequestType, res: Response) => Promise<PaginationResult>

export default class Pagination<T> {

  constructor (private query: Query<any, Document<T>>){}

  public async paginate<RequestType extends Request>(req: RequestType, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const endIndex = limit * page;

    const docCount = await MessageModel.countDocuments(this.query);

    const result: PaginationResult = {} as PaginationResult;

    result.pagesNecessary = Math.ceil(docCount / limit);

    result.data = await this.query.skip(startIndex).limit(limit).lean<T>();

    if (endIndex < docCount) {
      result.next = {
        page: page + 1,
        limit
      }
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit
      }
    }

    return result;
  }
}