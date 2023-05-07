const Joi = require('joi').extend(require('@joi/date'));

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': `Le nom de l'évènement ne peut pas être vide`,
      'string.min': `Le nom de l'évènement doit comporter au moins 2 caractères`,
      'string.max': `Le nom de l'évènement doit être inférieur ou égal à 50 caractères`,
      'string.required': `Le nom de l'évènement est un champ obligatoire`,
    }),
    category: Joi.string().max(30).required().messages({
      'string.empty': `La catégorie de l'évènement ne peut pas être vide`,
      'string.max': `La catégorie de l'évènement doit être inférieur ou égal à 30 caractères`,
      'string.required': `La catégorie de l'évènement est un champ obligatoire`,
    }),
    date_time: Joi.date().format('DD/MM/YYYY HH:mm').utc().required().messages({
      'date.base': `Veuillez utilisez une date valide`,
      'date.format': `Veuillez utilisez une date valide au format DD/MM/YYY HH:mm`,
      'any.required': `La date de l'évènement est un champ obligatoire`
    }),
    user_max: Joi.number().min(0).max(50).required().messages({
      'number.base': `Veuillez utilisez un numéro valid`,
      'number.min': `Le minimum des utilisateurs doit comporter au moins 0 caractères`,
      'number.max': `Le maximum des utilisateurs doit être inférieur ou égal à 50 caractères`,
      'any.required': `La date de l'évènement est un champ obligatoire`
    }),
    place: Joi.string().max(510).required().messages({
      'string.empty': `L'address ne peut pas être vide`,
      'string.max': `L'address doit être inférieur ou égal à 510 caractères`,
      'string.required': `L'address est un champ obligatoire`,
    }),
    time: Joi.number().min(0).required().messages({
      'number.base': `Veuillez utilisez un numéro valid`,
      'number.min': `La duration minimale de l'evenement ne peut pas être 0`,
      'any.required': `L'heure de l'évènement est un champ obligatoire`
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': `Veuillez utilisez un numéro valid`,
      'number.min': `Le prix minimum de l'evenement ne peut pas être 0`,
      'any.required': `Le prix de l'évènement est un champ obligatoire`
    }),
    description: Joi.string().max(255).required().messages({
      'string.empty': `La description ne peut pas être vide`,
      'string.max': `La description doit être inférieur ou égal à 255 caractères`,
      'string.required': `La description est un champ obligatoire`,
    }),
    code: Joi.string().max(255).required().messages({
      'string.empty': `Le code postal ne peut pas être vide`,
      'string.max': `Le code postal doit être inférieur ou égal à 255 caractères`,
      'string.required': `Le code postal est un champ obligatoire`,
    }),
    department: Joi.string().max(255).required().messages({
      'string.empty': `Le département ne peut pas être vide`,
      'string.max': `Le département doit être inférieur ou égal à 255 caractères`,
      'string.required': `Le département est un champ obligatoire`,
    }),
    url_image: Joi.array().items(Joi.string())
  })
};

const search = {
  body: Joi.object().keys({
    category: Joi.string().required().messages({
      'string.required': `La catégorie est un champ obligatoire`,
    }),
    department: Joi.string().required().messages({
      'string.required': `Le département est un champ obligatoire`,
    }),
    code: Joi.string().allow(null),
    date: Joi.date().format('YYYY-MM-DD').utc().allow(null).messages({
      'date.base': `Veuillez utilisez une date valide`,
      'date.format': `Veuillez utilisez une date valide au format YYYY-MM-DD`
    }),
    numdepartment: Joi.string().required().messages({
      'string.required': `Le numero du departement est un champ obligatoire`,
    }),
    page: Joi.number().min(0).required().messages({
      'number.min': `La page de la recherche ne peut pas être 0`,
      'any.required': `La page de la recherche est un champ obligatoire`,
    }),
    limit: Joi.number().min(0).required().messages({
      'number.min': `La limite de la recherche ne peut pas être 0`,
      'any.required': `La limite de la recherche est un champ obligatoire`,
    }),
  }),
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'évènement doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'évènement est un champ obligatoire`,
    })
  })
};

const retrieve = {
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'évènement doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'évènement est un champ obligatoire`,
    })
  })
};

const delete_event = {
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'évènement doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'évènement est un champ obligatoire`,
    })
  })
};

const cancel_event = {
  body: Joi.object().keys({
    event_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'évènement doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'évènement est un champ obligatoire`,
    })
  })
};

const submit_event = {
  body: Joi.object().keys({
    event_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'évènement doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'évènement est un champ obligatoire`,
    })
  })
};

const accept_user = {
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'évènement doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'évènement est un champ obligatoire`,
    }),
    user_id: Joi.string().min(24).required().messages({
      'string.min': `L'id de l'utilisateur doit comporter au moins 24 caractères`,
      'any.required': `L'id de l'utilisateur est un champ obligatoire`,
    }),
  })
};

module.exports = {
  create,
  search,
  retrieve,
  cancel_event,
  submit_event,
  delete_event,
  accept_user,
};