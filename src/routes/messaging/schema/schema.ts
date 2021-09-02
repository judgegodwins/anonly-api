import Joi from 'joi';

export default {
  sendMessage: {
    params: Joi.object({
      username: Joi.string().required()
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
  }
}