const httpStatus = require('http-status');
const { Error } = require('mongoose');
const constants = require('../utils/Constantes');
// const { Event } = require('../models');
const errorF = require('../utils/error');
const eventService = require('../services/event.service');

const checkIfUserIsAdminEvent = async (req, res, next) => {
  try {
    const UserExistOnEvent = await eventService.IsUserAdminEvent(req);
    req.CurrentUserIsAdmin = UserExistOnEvent;
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }

};

const checkIfUserParticipeOnEvent = async (req, res, next) => {
  try {
    if (req.CurrentUserIsAdmin != true) {
      const UserExistOnEvent = await eventService.IsUserParticipeOnEvent(req);
      req.CurrentUserHasParticipant = UserExistOnEvent;
    }
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
};

const eventExistAndNotDone = async (req, res, next) => {
  try {
    const event = await eventService.findOneById(req.params._id);

    if (!event || event.date_time < Date.now() || event.is_validate == false) {
      const error = new Error('Aucun évènement est répertorié');
      errorF(error.message, error, httpStatus.NOT_FOUND, res, next);
    }

    next();
  }
  catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
};

const ifUserIsAdminEvent = async (req, res, next) => {
  await checkIfUserIsAdminEvent(req, res, next);
  next();
};

const ifUserParticipeOnEvent = async (req, res, next) => {
  await checkIfUserParticipeOnEvent(req, res, next);
  next();
};

const userCanParticipateOnEvent = async (req, res, next) => {
  req.params._id = req.body.event_id;
  await checkIfUserParticipeOnEvent(req, res, next);
  if (req.CurrentUserHasParticipant == true) {
    const error = new Error(constants.MESSAGE.ERROR_USER_EVEN_PARTICIPATION_ON_EVENT);
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }

  const hasPlace = await eventService.hasPlaceToParticipeOnEvent(req);
  if (hasPlace == false) {
    const error = new Error(constants.MESSAGE.NO_PLACE_ON_EVENT);
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
  else {
    next();
  }
};

const userCanCancelParticipationOnEvent = async (req, res, next) => {
  req.params._id = req.body.event_id;
  await checkIfUserParticipeOnEvent(req, res, next);
  if (req.CurrentUserHasParticipant == false) {
    const error = new Error(constants.MESSAGE.USER_NOT_REFENCY_ON_EVENT);
    errorF(error.message, error, httpStatus.UNAUTHORIZED, res, next);
  }
  else {
    next();
  }
};

const userCanCancelEvent = async (req, res, next) => {

  const evenId = req.params._id;
  const event = await eventService.findOneById(evenId);
  if (event.creator == req.user.userId) {
    next();
  }
  else {
    const error = new Error(constants.MESSAGE.CANCEL_EVENT_NOT_AUTHORIZE);
    errorF(error.message, error, httpStatus.UNAUTHORIZED, res, next);
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