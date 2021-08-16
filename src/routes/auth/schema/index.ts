import Joi from 'joi';

export default {
  signup: Joi.object({
    username: Joi.string().required().min(5),
    email: Joi.string().optional().email(),
    password: Joi.string().required().min(6),
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(6)
  })
}