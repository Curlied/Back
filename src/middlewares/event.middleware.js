const httpStatus = require('http-status');
const { Error } = require('mongoose');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const eventService = require('../services/event.service');
const { retrieve_user_from_token } = require('../middlewares/user.middleware');
const { getHeaderToken } = require('../utils/jwt');


const eventExistAndNotDone = async (request, response, next) => {
  const { params } = request;
  const { event_id } = params;
  const event = await eventService.findOneById(event_id);
  if (!event || !event.is_validate) {
    const error = new Error('Aucun évènement est répertorié ou votre évènement n`\'est pas encore validé');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  next();
};

const ifUserIsAdminEvent = async (request, response, next) => {
  const { params } = request;
  const { event_id } = params;
  const { userId } = await retrieve_user_from_token(getHeaderToken(request));
  const UserExistOnEvent = await eventService.IsUserAdminEvent(event_id, userId);
  request.CurrentUserIsAdmin = UserExistOnEvent;
  next();
};

const checkIfUserParticipeOnEvent = async (request) => {
  if (!request.CurrentUserIsAdmin) {
    const UserExistOnEvent = await eventService.IsUserParticipeOnEvent(request);
    request.CurrentUserHasParticipant = UserExistOnEvent;
  }
  return request;
};

const ifUserParticipeOnEvent = async (request, response, next) => {
  request = await checkIfUserParticipeOnEvent(request);
  next();
};

const userCanParticipateOnEvent = async (request, response, next) => {
  const { params } = request;
  const { event_id } = params;
  const isCreator = await eventService.IsUserAdminEvent(req);

  if(isCreator === true){
    const error = new Error(constants.MESSAGE.ERROR_EVENT_PARTICIPATION_YOU_AE_CREATOR);
    return errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
  
  request = await checkIfUserParticipeOnEvent(request);
  if (request.CurrentUserHasParticipant) {
    const error = new Error(constants.MESSAGE.ERROR_USER_EVEN_PARTICIPATION_ON_EVENT);
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  }

  const hasPlace = await eventService.hasPlaceToParticipeOnEvent(event_id);
  if (!hasPlace) {
    const error = new Error(constants.MESSAGE.NO_PLACE_ON_EVENT);
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  }
  next();
};

const userCanCancelParticipationOnEvent = async (request, response, next) => {
  request = await checkIfUserParticipeOnEvent(request);
  if (request.CurrentUserHasParticipant) {
    const error = new Error(constants.MESSAGE.USER_NOT_REFENCY_ON_EVENT);
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
  next();
};

const userCanCancelEvent = async (request, response, next) => {
  const { params } = request;
  const { event_id } = params;
  const event = await eventService.findOneById(event_id);
  const { userId } = await retrieve_user_from_token(getHeaderToken(request));
  if (event.creator == userId) {
    next();
  }
  else {
    const error = new Error(constants.MESSAGE.CANCEL_EVENT_NOT_AUTHORIZE);
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
};

module.exports = {
  userCanParticipateOnEvent,
  userCanCancelParticipationOnEvent,
  userCanCancelEvent,
  ifUserIsAdminEvent,
  ifUserParticipeOnEvent,
  eventExistAndNotDone
};