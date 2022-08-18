import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Logger from '../core/Logger';
import { BadRequestError } from '../core/ApiError';

export enum ValidationSource {
  Body = 'body',
  Header = 'headers',
  Query = 'query',
  Param = 'params'
}

export default (schema: Joi.ObjectSchema, source = ValidationSource.Body) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log('source: ', source);
  const { error, value } = schema.validate(req[source]);

  console.log('VALUE: ', value);
  console.log('bODY: ', req.body);
  // req.body = value;

  if (!error) return next();

  const { details } = error;
  // console.log('details: ', details);
  const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');

  next(new BadRequestError(message));
}