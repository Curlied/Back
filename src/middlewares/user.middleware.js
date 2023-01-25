const httpStatus = require('http-status');
const { User } = require('../models');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { getHeaderToken } = require('../utils/jwt');
const { isValid } = require('mongoose').Types.ObjectId;

const isUniqueMail = async (request, response, next) => {
  const { body } = request;
  const { email } = body;
  const user = await User.findOne({
    email: email,
  });

  if (user) {
    const error = new Error(constants.MESSAGE.EMAIL_ALSO_EXIST);
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  } else {
    next();
  }
};

const isValidate = async (request, response, next) => {
  const user = await User.findOne({
    email: request.body?.email,
  });

  if (!user) {
    const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
  else if (!user.is_validate) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_NOT_MADE);
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  } else {
    next();
  }
};

const retrieve_user_from_token = async (token) => {
  try {
    const token_decoded = await jwt.verify(token, config.token.secret);
    return { error: undefined, token: token_decoded };
  } catch (err) {
    return { error: err.message, token: undefined };
  }
};

const user_is_connected = async (request, response, next) => {
  const { error: error_message } = await retrieve_user_from_token(getHeaderToken(request));
  if (error_message) {
    const error = new Error(error_message);
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
  next();
};

const isAdmin = async (request, response, next) => {
  const { token: { roles } } = await retrieve_user_from_token(getHeaderToken(request));
  if (roles.includes('637e94d2e845adc63df775a9')) {
    next();
  } else {
    const error = new Error('Vous n\'êtes pas autorisé');
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
};

const theRequestorIsTokenUser = async (request, response, next) => {
  const { body } = request;
  const { token: { email } } = await retrieve_user_from_token(getHeaderToken(request));
  if (!body) {
    const error = new Error('Les paramètres sont vides');
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  }
  if (body.email === email) {
    next();
  }
  else {
    const error = new Error('Opération impossible veuillez vous connectez avec le bon compte');
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
};


const check_email_changes = async (request, response, next) => {
  const { body } = request;
  const { token: { email } } = await retrieve_user_from_token(getHeaderToken(request));
  if (body?.email !== email) {
    next();
  } else {
    const error = new Error(constants.MESSAGE.EMAIL_CONFLIT);
    return errorF(error, httpStatus.CONFLICT, response);
  }
};

const check_user_exist = async (request, response, next) => {
  const { params } = request;
  const { user_id } = params;
  if (!isValid(user_id)) {
    const error = new Error(constants.MESSAGE.OBJECTID_NOT_VALID);
    return errorF(error, httpStatus.BAD_REQUEST, response);
  }
  const user = await User.findOne({
    _id: user_id,
  });
  if (!user) {
    const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
    return errorF(error, httpStatus.BAD_REQUEST, response);
  }
  next();
};

module.exports = {
  isUniqueMail,
  isValidate,
  user_is_connected,
  isAdmin,
  retrieve_user_from_token,
  theRequestorIsTokenUser,
  check_email_changes,
  check_user_exist
};