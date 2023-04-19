const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.empty': `Le nom d'utilisateur ne peut pas être vide`,
      'string.max': `Le nom d'utilisateur doit être inférieur ou égal à 30 caractères`,
      'string.required': `Le nom d'utilisateur est un champ obligatoire`,
    }),
    description: Joi.string().min(25).max(255).required().messages({
      'string.empty': `La description ne peut pas être vide`,
      'string.min': `La description doit comporter au moins 25 caractères`,
      'string.max': `La description doit être inférieur ou égal à 255 caractères`,
      'string.required': `La description est un champ obligatoire`,
    }),
    url_image: Joi.string().max(255),
    url_icon: Joi.string().max(255),
  })
};

const update = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.empty': `Le nom d'utilisateur ne peut pas être vide`,
      'string.max': `Le nom d'utilisateur doit être inférieur ou égal à 30 caractères`,
      'string.required': `Le nom d'utilisateur est un champ obligatoire`,
    }),
    description: Joi.string().min(25).max(255).required().messages({
      'string.empty': `La description ne peut pas être vide`,
      'string.min': `La description doit comporter au moins 25 caractères`,
      'string.max': `La description doit être inférieur ou égal à 255 caractères`,
      'string.required': `La description est un champ obligatoire`,
    }),
    url_image: Joi.string().max(255).messages({
      'string.empty': `L'url de l'image ne peut pas être vide`,
      'string.max': `L'url de l'image doit être inférieur ou égal à 255 caractères`,
      'string.required': `L'url de l'image est un champ obligatoire`,
    }),
    url_icon: Joi.string().max(255).messages({
      'string.max': `L'url de l'icon doit être inférieur ou égal à 255 caractères`,
    })
  }),
  params: Joi.object().keys({
    category_id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).required().messages({
      'string.pattern.base': `L'id de la catégorie doit être un GUID valid`,
      'string.required': `L'id de la catégorie est un champ obligatoire`,
    })
  })
};

const retrieve = {
  params: Joi.object().keys({
    category_id: Joi.string().required().messages({
      'string.empty': `L'id de la catégorie ne peut pas être vide`,
      'string.required': `L'id de la catégorie est un champ obligatoire`,
    })
  })
};

module.exports = {
  create,
  update,
  retrieve
};