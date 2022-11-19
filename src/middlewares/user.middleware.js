const httpStatus = require('http-status');
const { User } = require('../models');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const config = require('../config');
const jwt = require('jsonwebtoken');

const isUniqueMail = async (request, response, next) => {
  const { body } = request;
  const { email } = body;
  const user = await User.findOne({
    email: email,
  });

  if (user || !Object.keys(user).length) {
    const error = new Error(constants.MESSAGE.EMAIL_ALSO_EXIST);
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  } else {
    next();
  }
};

const isValidate = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
    return errorF(error, httpStatus.UNAUTHORIZED, res);
  }
  else if (!user.is_validate) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_NOT_MADE);
    return errorF(error, httpStatus.UNAUTHORIZED, res);
  } else {
    next();
  }
};

const retrieve_user_from_token = async (token) => {
  const user = jwt.verify(token, config.token.secret);
  return user.userId;
};

const user_is_connected = async (request, response, next) => {
  const token = request?.cookies?.access_token;
  if (!token) {
    const error = new Error('Il semblerait qu\'il manque le token');
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
  next();
};

const isAdmin = async (request, response, next) => {
  const roles = request.user.roles;
  if (roles.includes('619f8c5e274ed82841f49d6e')) {
    next();
  } else {
    const error = new Error('Vous n\'êtes pas autorisé');
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
};

module.exports = {
  isUniqueMail,
  isValidate,
  user_is_connected,
  isAdmin,
  retrieve_user_from_token
};