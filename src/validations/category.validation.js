const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(25).max(255).required(),
    url_image: Joi.string().max(255),
    url_icon: Joi.string().max(255),
  })
};

const update = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(25).max(255).required(),
    url_image: Joi.string().max(255),
    url_icon: Joi.string().max(255)
  }),
  params: Joi.object().keys({
    category_id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).required()
  })
};

const retrieve = {
  params: Joi.object().keys({
    category_id: Joi.string().required()
  })
};

module.exports = {
  create,
  update,
  retrieve
};