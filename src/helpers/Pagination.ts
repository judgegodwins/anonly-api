import { Query, Document } from "mongoose";
import { Request, Response } from 'express';
// import { MessageModel } from "../database/models/Message";

export interface PaginationResult<T> {
  data: T;
  pagesNecessary?: number;
  count?: number;
  next?: {
    page: number;
    limit: number;
  }
  previous?: {
    page: number;
    limit: number;
  }
}

export default class Pagination<T, DataType = any> {

  constructor (private query: Query<any, Document<any, any, T>>){}

  public async paginate<RequestType extends Request>(req: RequestType, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const endIndex = limit * page;

    const docCount = await this.query.model.countDocuments(this.query);

    const result: PaginationResult<DataType> = {} as PaginationResult<DataType>;

    result.count = docCount;
    result.pagesNecessary = Math.ceil(docCount / limit);

    result.data = await this.query.skip(startIndex).limit(limit);

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