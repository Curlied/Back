const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
  })
};

const update = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
  }),
  params: Joi.object().keys({
    role_id: Joi.string().min(24).required(),
  })
};

const retrieve = {
  params: Joi.object().keys({
    role_id: Joi.string().min(24).required(),
  })
};

module.exports = {
  create,
  update,
  retrieve,
};