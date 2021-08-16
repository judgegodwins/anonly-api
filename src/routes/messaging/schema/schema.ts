import Joi from 'joi';

export default {
  params: Joi.object({
    username: Joi.string().required()
  }),
  body: Joi.object({
    text: Joi.string().required()
  })
}