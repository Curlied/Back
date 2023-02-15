const Joi = require('joi').extend(require('@joi/date'));

const create = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(50).required(),
    category: Joi.string().max(30).required(),
    date_time: Joi.date().format('DD/MM/YYYY HH:mm').utc().required(),
    user_max: Joi.number().min(0).max(50).required(),
    place: Joi.string().max(510).required(),
    time: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().max(255).required(),
    code: Joi.string().max(255).required(),
    department: Joi.string().max(255).required(),
    url_image: Joi.array().items(Joi.string())
  })
};

const search = {
  body: Joi.object().keys({
    category: Joi.string().required(),
    department: Joi.string().required(),
    code: Joi.string().allow(null),
    date: Joi.date().format('YYYY-MM-DD').utc().allow(null),
    numdepartment: Joi.string().required()
  }),
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required()
  })
};

const retrieve = {
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required()
  })
};

const delete_event = {
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required()
  })
};

const cancel_event = {
  body: Joi.object().keys({
    event_id: Joi.string().min(24).required()
  })
};

const submit_event = {
  body: Joi.object().keys({
    event_id: Joi.string().min(24).required()
  })
};

const accept_user = {
  params: Joi.object().keys({
    event_id: Joi.string().min(24).required(),
    user_id: Joi.string().min(24).required(),
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