const Joi = require('Joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
  })
};

module.exports = {
  create
};