const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(25).max(255).required(),
    image: Joi.string().max(255)
  })
};

module.exports = {
  create
};