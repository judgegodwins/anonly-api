import Joi from "joi";

export default {
  signup: Joi.object({
    username: Joi.string().required().min(5).max(20),
    email: Joi.string().optional().email(),
    password: Joi.string().required().min(8),
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  verification: {
    request: {
      body: Joi.object({
        email: Joi.string().required().email(),
      }),
      query: Joi.object({
        updateEmail: Joi.bool().optional(),
      })
    },
    verify: Joi.object({
      code: Joi.string().required(),
    }),
  },
};
