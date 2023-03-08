const Joi = require('joi');

const userUpdate = {
  body: Joi.object({
    username: Joi.string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30)
      .required(),
    birth_date: Joi.date().raw().required(),
    telephone: Joi.string().regex(/(^[0-9]+$)/).required(),
  })
}

const bodyPassword = {
  body: Joi.object().keys({
    password: Joi.string().trim().min(6).required(),
  })
};

module.exports = {
  userUpdate,
  bodyPassword,
};