import Joi from 'joi';

export default {
  authHeader: Joi.object().keys({
    authorization: Joi.string().custom((value: string, helpers: Joi.CustomHelpers) => {
      if (!value.startsWith("Bearer ")) return helpers.error('any.invalid');
      if (!value.split(' ')[1]) return helpers.error('any.invalid');
      return value;
    }, "Auth header validation").required()
  })
}