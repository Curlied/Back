const responses = require('../models/responses');

const success = (message, body, code, res, next) => {
  res.status(code);
  res.json(
    new responses(message, body)
  );
  return next(res);
};

module.exports = success;