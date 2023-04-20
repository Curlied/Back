const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const constants = require('../utils/Constantes');
const fs = require('fs');
const { ReplaceUserNameAndUrl, getConfirmPasswordKey, deleteKey } = require('../services/email.service');
const httpStatus = require('http-status');
const errorF = require('../utils/error');
const successF = require('../utils/success');

const register = async (request, response) => {
  try {
    const { body } = request;
    const userCreated = await userService.create(body);
    const urlTemp = await emailService.GetTempURl(userCreated.email);
    let emailHtml = fs
      .readFileSync(process.cwd() + '/public/templates/confirmation-inscription.html')
      .toString();

    emailHtml = await ReplaceUserNameAndUrl(
      emailHtml,
      userCreated.username,
      urlTemp
    );
    await emailService.sendHtmlEmail(
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
  } catch (error) {
    return errorF(error, httpStatus.BAD_REQUEST, response);
  }
};

const login = async (request, response) => {
  const { body } = request;
  const { email, password } = body;
  const { token, username } = await userService.login(email, password);
  if (!token) {
    const error = new Error('Invalid Credentials');
    return errorF(error, httpStatus.BAD_REQUEST, response);
  }
  return successF(
    'The connection has been done',
    { username, token },
    httpStatus.OK,
    response
  );
};

const email_confirmation = async (request, response) => {
  const { query } = request;
  const { key } = query;
  const MagicKey = key || '';
  const email = await getConfirmPasswordKey(MagicKey);
  if (!email) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_NOT_POSSIBLE);
    return errorF(error, httpStatus.BAD_REQUEST, response);
  }

  const user = await userService.findOneAndConfirm(email);
  if (user && !user.is_validate) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_MAIL_ERROR);
    return errorF(error, httpStatus.NON_AUTHORITATIVE_INFORMATION, response);
  }

  await deleteKey(MagicKey);
  return successF(
    constants.MESSAGE.CONFIRMATION_MAIL_SUCCESS,
    '',
    httpStatus.NO_CONTENT,
    response
  );
};

const disconnect = async (request, response) => {
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
  disconnect,
};
