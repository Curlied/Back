const Joi = require('joi');

const userUpdate = {
  body: Joi.object({
    username: Joi.string()
      .regex(/(^[a-zA-Z0-9_]+$)/)
      .min(2)
      .max(30)
      .required().messages({
        'string.empty': `Le nom de l'utilisateur ne peut pas être vide`,
        'string.min': `Le nom de l'utilisateur doit comporter au moins 2 caractères`,
        'string.max': `Le nom de l'utilisateur doit être inférieur ou égal à 30 caractères`,
        'string.pattern.base': `Le nom de l'utilisateur est un champ obligatoire`,
        'string.required': `Le nom de l'utilisateur est un champ obligatoire`
      }),
    birth_date: Joi.date().raw().required().messages({
      'date.base': `Veuillez utilisez un date valid`,
      'any.required': `La date de naissance est un champ obligatoire`
    }),
    telephone: Joi.string().regex(/(^[0-9]+$)/).allow('').messages({
      'string.empty': `Le téléphone ne peut pas être vide`,
      'string.required': `Le téléphone est un champ obligatoire`,
      'string.pattern.base': `Veuillez utilisez un téléphone valid`
    }),
  })
}

const bodyPassword = {
  body: Joi.object().keys({
    password: Joi.string().trim().min(6).required().messages({
      'string.min': `Le mot de passe doit comporter au moins 6 caractères`,
      'string.trim': `Veuillez enlevez les spaces dans le mot de passe`
    }),
  })
};

module.exports = {
  userUpdate,
  bodyPassword,
};