const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.empty': `Le nom du rôle ne peut pas être vide`,
      'string.min': `Le nom du rôle doit comporter au moins 2 caractères`,
      'string.max': `Le nom du rôle doit être inférieur ou égal à 30 caractères`,
      'string.required': `Le nom de l'utilisateur est un champ obligatoire`
    })
  })
};

const update = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.empty': `Le nom du rôle ne peut pas être vide`,
      'string.min': `Le nom du rôle doit comporter au moins 2 caractères`,
      'string.max': `Le nom du rôle doit être inférieur ou égal à 30 caractères`,
      'string.required': `Le nom de l'utilisateur est un champ obligatoire`
    })
  }),
  params: Joi.object().keys({
    role_id: Joi.string().min(24).required().messages({
      'string.empty': `L'id du rôle id ne peut pas être vide`,
      'string.min': `L'id du rôle doit comporter au moins 24 caractères`,
      'string.required': `L'id du rôle est un champ obligatoire`
    }),
  })
};

const retrieve = {
  params: Joi.object().keys({
    role_id: Joi.string().min(24).required().messages({
      'string.empty': `L'id du rôle id ne peut pas être vide`,
      'string.min': `L'id du rôle doit comporter au moins 24 caractères`,
      'string.required': `L'id du rôle est un champ obligatoire`
    }),
  })
};

module.exports = {
  create,
  update,
  retrieve,
};