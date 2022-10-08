const responses = require('../models/responses');
const config = require('../config/index');

const error = (message, error, code, res, next) => {
  res.status(code);
  if (config.environment == 'prod') {
    res.json(
      new responses(message, {})
    );
  } else {
    res.json(
      new responses(message, `${error}`)
    );
  }
  return next(res);
};

module.exports = error;