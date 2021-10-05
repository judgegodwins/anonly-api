import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export default {
  signup: Joi.object({
    username: Joi.string().required().min(5),
    email: Joi.string().optional().email(),
    password: Joi.string().required().min(6),
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  verification: {
    request: Joi.object({
      email: Joi.string().required().email()
    }),
    verify: Joi.object({
      userId: Joi.custom((value: string, helpers) => {
        if (!isValidObjectId(value)) 
          return helpers.error('any.invalid')
        
        return value;
      }),
      id: Joi.string().required()
    })
  }
}