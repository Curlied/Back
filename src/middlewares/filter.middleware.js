const errorF = require('../utils/error');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config');

const filterF = (allowed = []) => (request, response, next) => {
  const {
    filter
  } = request.query;
  var isRight = true;
  var filterTrue = {};
  let isAdmin = false;
  const token = request.cookies?.access_token;

  jwt.verify(token, config.token.secret, (error, user) => {
    if (user) { // dans le cas où le token expire entre temps de connexion et de suppression client
      const roles = user.roles;
      if (roles.includes('619f8c5e274ed82841f49d6e')) {
        isAdmin = true;
      }
    }
  });
  if (filter) {
    const arrayFilter = filter.split(';');
    arrayFilter.forEach(element => {
      const splitElement = element.split('=');
      if (splitElement.length < 2) {
        isRight = false;
        const error = new Error('Il semblerait avoir une erreur dans le filtre (manque un =)');
        return errorF(error, httpStatus.NOT_ACCEPTABLE, response, next);
      }
      if (!allowed.includes(splitElement[0]) && !isAdmin) {
        isRight = false;
        const error = new Error(`Le champs "${splitElement[0]}" n'est pas autorisé`);
        return errorF(error, httpStatus.NOT_ACCEPTABLE, response, next);
      }
      if (splitElement[0].includes('id')) {
        filterTrue[splitElement[0]] = String(splitElement[1]);
      } else {
        filterTrue[splitElement[0]] = {
          $regex: new RegExp(String(splitElement[1]), 'i')
        };
      }
      if (typeof splitElement[1] == 'boolean') {
        filterTrue[splitElement[0]] = splitElement[1];
      }
    });
  }
  request.filter = filterTrue;
  if (isRight)
    next();
};

module.exports = filterF;