const Joi = require('joi');

const body_email = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  })
};

const userId = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).required()
  })
};

module.exports = {
  body_email,
  userId
};