import Joi from 'joi';

export default {
  sendMessage: {
    query: Joi.object({
      user: Joi.string().required()
    }),
    body: Joi.object({
      text: Joi.string().required()
    })
  },
  viewMessages: {
    query: Joi.object({
      page: Joi.number().required(),
      limit: Joi.number().required()
    }).unknown(true)
  },
  findUser: {
    query: Joi.object({
      username: Joi.string().required()
    }).unknown(true)
  }
}