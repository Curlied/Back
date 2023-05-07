const Joi = require('joi');

const register = {
  body: Joi.object({
    username: Joi.string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.empty': `Le nom d'utilisateur ne peut pas être vide`,
        'string.required': `Le nom d'utilisateur est un champ obligatoire`,
        'string.min': `Le nom d'utilisateur doit comporter au moins 2 caractères`,
        'string.max': `Le nom d'utilisateur doit être inférieur ou égal à 30 caractères`,
        'string.pattern.base': `Le nom d'utilisateur doit être un valeur alphanumeric`
      }),
    password: Joi.string().trim().min(6).required().messages({
      'string.empty': `Le mot de passe ne peut pas être vide`,
      'string.min': `Le mot de passe doit comporter au moins 6 caractères`,
      'string.required': `Le mot de passe est un champ obligatoire`,
    }),
    email: Joi.string().required().email().messages({
      'string.empty': `L'email ne peut pas être vide`,
      'string.required': `L'email est un champ obligatoire`,
      'string.email': `Veuillez utilisez une adresse email valide`
    }),
    birth_date: Joi.date().required().messages({
      'date.base': `Veuillez utilisez une date valide`
    }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Le mot de passe de confirmation ne corresponds pas au mot de passe'
    }),
    telephone: Joi.string().regex(/(^[0-9]+$)/).messages({
      'string.empty': `Le téléphone ne peut pas être vide`,
      'string.required': `Le téléphone est un champ obligatoire`,
      'string.pattern.base': `Veuillez utilisez un téléphone valid`
    }),
    url_image: Joi.any(),
  }),
  query: Joi.object({
    key: Joi.string()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.empty': `L'email ne peut pas être vide`,
      'string.required': `L'email est un champ obligatoire`,
      'string.email': `Veuillez utilisez une adresse email valide`
    }),
    password: Joi.string().min(1).required().messages({
      'string.empty': `Le mot de passe ne peut pas être vide`,
      'string.min': `Le mot de passe doit comporter au moins 1 caractères`,
      'string.required': `Le mot de passe est un champ obligatoire`,
    }),
  })
};

module.exports = {
  register,
  login,
};