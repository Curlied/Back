const httpStatus = require('http-status');
const { User } = require('../models');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const config = require('../config');
const jwt = require('jsonwebtoken');

const isUniqueMail = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (user) {
    const error = new Error(constants.MESSAGE.EMAIL_ALSO_EXIST);
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  } else {
    return next();
  }
};

const isValidate = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    const error = new Error(constants.MESSAGE.USER_NOT_EXIST);
    errorF(error.message, error, httpStatus.UNAUTHORIZED, res, next);
  }
  else if (!user.is_validate) {
    const error = new Error(constants.MESSAGE.CONFIRMATION_NOT_MADE);
    errorF(error.message, error, httpStatus.UNAUTHORIZED, res, next);
  } else {
    return next();
  }
};

const isConnected = async (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  
  if (!token) {
    const err = new Error('Il semblerait qu\'il manque le token');
    errorF(err.message, err, httpStatus.UNAUTHORIZED, res, next);
  }
  else {
    jwt.verify(token, config.token.secret, (error, user) => {
      if (error) {
        res.clearCookie('access_token'); // s'assure qu'il n'y a pas de token en mémoire coté client
        errorF('Vous n\'êtes pas connecté', error, httpStatus.UNAUTHORIZED, res, next);
      }
      if (!user) { // dans le cas où le token expire entre temps de connexion et de suppression client
        return next();
      } else {
        req.user = user;
        next();
      }
    });
  }
};

// const isMine = (schema) => async (req, res, next) => {
//   const userId = req.user.userId;

// };

const isAdmin = async (req, res, next) => {
  const roles = req.user.roles;
  if(roles.includes('619f8c5e274ed82841f49d6e')){
    return next();
  }
  const error = new Error('Vous n\'êtes pas autorisé');
  errorF(error.message, error, httpStatus.UNAUTHORIZED, res, next);
};

module.exports = {
  isUniqueMail,
  isValidate,
  isConnected,
  isAdmin
};