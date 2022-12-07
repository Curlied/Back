const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(25).max(255).required(),
    url_image: Joi.string().required(),
    url_icon: Joi.string().required(),
  })
};

module.exports = {
  create
};