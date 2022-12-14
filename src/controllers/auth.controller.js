const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const constants = require('../utils/Constantes');
const fs = require('fs');
const { Cache, ReplaceUserNameAndUrl } = require('../services/email.service');
const httpStatus = require('http-status');
const errorF = require('../utils/error');
const successF = require('../utils/success');
const configs = require('../config/index');

const register = async (request, response) => {
  const { body } = request;
  const userCreated = await userService.create(body);
  const urlTemp = emailService.GetTempURl(userCreated.email);
  let emailHtml = fs
    .readFileSync(constants.EMAIL_TEMPLATE.PATH_CONFIRMATION_INSCRIPTION)
    .toString();

  emailHtml = await ReplaceUserNameAndUrl(
    emailHtml,
    userCreated.username,
    urlTemp
  );
  emailService.sendHtmlEmail(
    userCreated.email,
    'Confirmation inscription',
    emailHtml
  );
  return successF(
    constants.MESSAGE.REGISTER_SUCCES,
    userCreated,
    httpStatus.OK,
    response
  );
};

const login = async (request, response) => {
  const { body } = request;
  const { email, password } = body;
  const { token, username } = await userService.login(email, password);
  if (!token) {
    var error = new Error('Invalid Credentials');
    return errorF(error, httpStatus.BAD_REQUEST, response);
  }
  response.cookie('access_token', token, {
    httpOnly: true,
    secure: configs.environment === 'prod',
  });
  return successF(
    'The connection has been done',
    username,
    httpStatus.OK,
    response
  );
};

const email_confirmation = async (request, response) => {
  const { query } = request;
  const { key } = query;
  const MagicKey = key || '';
  const email = Cache.get(MagicKey);
  if (!email) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_NOT_POSSIBLE);
    return errorF(
      error,
      httpStatus.BAD_REQUEST,
      response
    );
  }

  const user = await userService.findOneAndUpdate(email);
  if (user && !user.is_validate) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_ERROR);
    return errorF(error, httpStatus.NON_AUTHORITATIVE_INFORMATION, response);
  }

  Cache.del(MagicKey);
  return successF(
    constants.MESSAGE.CONFIRMATION_MAIL_SUCCESS,
    '',
    httpStatus.NO_CONTENT,
    response
  );
};

const disconnect = async (request, response) => {
  response.clearCookie('access_token');
  return successF(
    constants.MESSAGE.DISCONNECT_OK,
    '',
    httpStatus.NO_CONTENT,
    response
  );
};

module.exports = {
  register,
  login,
  email_confirmation,
  disconnect
};