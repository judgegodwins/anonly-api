import { Query, Document } from "mongoose";
import { Request, Response } from 'express';
import { MessageModel } from "../models/Message";

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

export default abstract class BaseRepo {

  public static paginate<T>(query: Query<any, Document<T>>): {paginate: PaginationFunction} {
    return {
      paginate: async function <RequestType extends Request>(req: RequestType, res: Response) {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);

        const startIndex = (page - 1) * limit;
        const endIndex = limit * page;

        console.log('nums: ', startIndex, ' ', endIndex, ' ', limit, ' ', page);

        const docCount = await MessageModel.countDocuments(query);

        const result: PaginationResult = {} as PaginationResult;

        console.log('count, pneces ', docCount, docCount / limit);
        result.pagesNecessary = Math.ceil(docCount / limit);

        console.log('paginating...')
        result.data = await query.skip(startIndex).limit(limit).lean<T>();

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
  }
}