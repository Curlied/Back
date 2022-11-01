/* eslint-disable indent */
const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const {
    value,
    error
  } = Joi.compile(validSchema)
    .prefs({
      errors: {
        label: 'key',
      },
      abortEarly: false,
    })
    .validate(object);
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    const statusCode =
      res.statusCode !== httpStatus.OK ?
        res.statusCode :
        httpStatus.BAD_REQUEST;
    res.status(statusCode);
    if (process.env.NODE_ENV == 'prod') {
      res.json({
        message: errorMessage,
      });
    } else {
      res.json({
        message: errorMessage,
        stack: error.stack,
      });
    }
    return next(res);
  }
  Object.assign(req, value);
  next();
};

module.exports = validate;