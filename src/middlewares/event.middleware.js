const httpStatus = require('http-status');
const { Error } = require('mongoose');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const eventService = require('../services/event.service');
const { retrieve_user_from_token } = require('../middlewares/user.middleware');

const eventExistAndNotDone = async (request, response, next) => {
  const { params } = request;
  const { event_id } = params;
  const event = await eventService.findOneById(event_id);
  if (!event || event.date_time < Date.now() || !event.is_validate) {
    const error = new Error('Aucun évènement est répertorié');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  next();
};

const checkIfUserIsAdminEvent = async (request, next) => {
  const { params } = request;
  const { event_id } = params;
  const user_id = retrieve_user_from_token(request.cookies.access_token);
  const UserExistOnEvent = await eventService.IsUserAdminEvent(event_id, user_id);
  request.CurrentUserIsAdmin = UserExistOnEvent;
  next();
};

const ifUserIsAdminEvent = async (request, next) => {
  await checkIfUserIsAdminEvent(request, next);
  next();
};

const checkIfUserParticipeOnEvent = async (request, next) => {
  const { params } = request;
  const { even_id } = params;
  if (!request.CurrentUserIsAdmin) {
    const UserExistOnEvent = await eventService.IsUserParticipeOnEvent(even_id);
    request.CurrentUserHasParticipant = UserExistOnEvent;
  }
  next();
};

const ifUserParticipeOnEvent = async (request, next) => {
  await checkIfUserParticipeOnEvent(request, next);
  next();
};

const userCanParticipateOnEvent = async (request, response, next) => {
  const { body } = request;
  const { event_id } = body;
  await checkIfUserParticipeOnEvent(request, next);
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
  await checkIfUserParticipeOnEvent(request, next);
  if (!request.CurrentUserHasParticipant) {
    const error = new Error(constants.MESSAGE.USER_NOT_REFENCY_ON_EVENT);
    return errorF(error, httpStatus.UNAUTHORIZED, response);
  }
  next();
};

const userCanCancelEvent = async (request, response, next) => {
  const { params } = request;
  const { event_id } = params;
  const event = await eventService.findOneById(event_id);
  if (event.creator == request.user.userId) {
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