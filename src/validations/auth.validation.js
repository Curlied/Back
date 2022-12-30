const Joi = require('joi');

const register = {
  body: Joi.object({
    username: Joi.string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30)
      .required(),
    password: Joi.string().trim().min(6).required(),
    email: Joi.string().email().required(),
    birth_date: Joi.date().raw().required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    telephone: Joi.string().regex(/(^[0-9]+$)/),
    url_image: Joi.any(),
  }),
  query: Joi.object({
    key: Joi.string()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
  })
};

module.exports = {
  register,
  login,
};