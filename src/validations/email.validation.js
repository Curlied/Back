const Joi = require('joi');

const body_email = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.empty': `L'email ne peut pas être vide`,
      'string.required': `L'email est un champ obligatoire`,
      'string.email': `Veuillez utilisez une adresse email valide`
    }),
  })
};

const userId = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).required().messages({
      'string.empty': `L'id de l'utilisateur ne peut pas être vide`,
      'string.length': `L'id de l'utilisateur doit comporter au moins 24 caractères`,
      'string.required': `La description est un champ obligatoire`,
    })
  })
};

module.exports = {
  body_email,
  userId
};