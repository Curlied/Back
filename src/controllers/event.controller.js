const eventService = require('../services/event.service');
const userService = require('../services/user.service');
const categoryService = require('../services/category.service');
const successF = require('../utils/success');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const httpStatus = require('http-status');
const { retrieve_user_from_token } = require('../middlewares/user.middleware');
const { getHeaderToken } = require('../utils/jwt');
const create = async (request, response) => {
  try {
    const { body: event } = request;
    const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
    const event_created = await eventService.create(userId, event);
    return successF(
      constants.MESSAGE.CONFIRMATION_EVENT_ADD,
      event_created,
      httpStatus.OK,
      response
    );
  }
  catch (err) {
    return errorF(
      err,
      httpStatus.INTERNAL_SERVER_ERROR,
      response
    );
  }
};

const getAll = async (_request, response) => {
  const events = await eventService.getAll() || [];

  let arrayEvent = events;
  // let arrayEvent = result.docs;

  for (let i = 0; i < arrayEvent.length; i++) {
    const category = await categoryService.FindOneById(arrayEvent[i].category);
    arrayEvent[i]._doc.categoryComplet = category;
    arrayEvent[i]._doc.nbUserActual = arrayEvent[i].users_valide.length;

    // remove all fileds don't need
    delete arrayEvent[i]._doc.description;
    delete arrayEvent[i]._doc.price;
    delete arrayEvent[i]._doc.time;
    delete arrayEvent[i]._doc.users_valide;
    delete arrayEvent[i]._doc.users_waiting;
    delete arrayEvent[i]._doc.users_refused;
    delete arrayEvent[i]._doc.users_cancel;
    delete arrayEvent[i]._doc.is_validate;
    delete arrayEvent[i]._doc.category;
    delete arrayEvent[i]._doc.creator;
  }
  return successF(
    'OK',
    events,
    httpStatus.OK,
    response
  );
};

const getAllFiltered = async (request, response) => {
  const { filter } = request;
  const events = await eventService.getAllFiltered(filter);
  for (let i = 0; i < events.length; i++) {
    const category = await categoryService.FindOneById(events[i].category);
    events[i]._doc.categoryComplet = category;
    events[i]._doc.nbUserActual = events[i].users_valide.length;

    // remove all fileds don't need
    delete events[i]._doc.description;
    delete events[i]._doc.price;
    delete events[i]._doc.time;
    delete events[i]._doc.users_valide;
    delete events[i]._doc.users_waiting;
    delete events[i]._doc.users_refused;
    delete events[i]._doc.users_cancel;
    delete events[i]._doc.is_validate;
    delete events[i]._doc.category;
    delete events[i]._doc.creator;
  }
  return successF(
    'OK',
    events,
    httpStatus.OK,
    response
  );
};

const getDetailsEvent = async (request, response) => {
  const { params } = request;
  const { event_id } = params;
  const event = await eventService.findOneById(event_id);
  const category = await categoryService.FindOneById(event.category);
  const usersIdArrayValidate = event.users_valide.map(w => w.user_id);
  const usersIdArrayWaiting = event.users_waiting.map(w => w.user_id);
  let eventObject = event?.toObject();

  let filter;
  if (request.CurrentUserIsAdmin) {
    eventObject.CurrentUserIsAdmin = true;
    filter = 'username telephone -_id';
  } else {
    eventObject.CurrentUserHasParticipant = request.CurrentUserHasParticipant;
    filter = 'username -_id';
  }

  const userParticipate = await userService.findManyById(usersIdArrayValidate, filter);
  const userWaiting = await userService.findManyById(usersIdArrayWaiting, filter);
  const userCreator = await userService.findOne(event.creator, 'username -_id');

  eventObject.category = category?.toObject();
  eventObject.users_valide = userParticipate.map(model => model.toObject());
  eventObject.users_waiting = userWaiting.map(model => model.toObject());
  eventObject.creator = userCreator?.toObject();
  delete eventObject.users_refused
  delete eventObject.users_cancel
  return successF(
    'OK',
    eventObject,
    httpStatus.OK,
    response
  );
};

const submitParticipation = async (request, response) => {
  const { params } = request;
  const { event_id } = params;
  const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
  await eventService.submitParticipant(userId, event_id);
  return successF(
    constants.MESSAGE.DEMAND_PARTICIPATION_IS_OK,
    true,
    httpStatus.OK,
    response
  );
};

const cancelParticipation = async (request, response) => {
  const { params } = request;
  const { event_id } = params;
  const { token: { userId } } = await retrieve_user_from_token(getHeaderToken(request));
  await eventService.cancelParticipant(userId, event_id);
  return successF(
    constants.MESSAGE.CANCEL_PARTICIPATION_ON_EVENT_OK,
    true,
    httpStatus.OK,
    response
  );
};

const cancelEvent = async (request, response) => {
  const { params } = request;
  const { event_id } = params;
  const event = await eventService.cancelEvent(event_id);
  if (event.date_time.getFullYear() != 0) {
    const error = new Error('Error in event anulation');
    return errorF(error, httpStatus.NOT_ACCEPTABLE, response);
  }
  return successF(
    constants.MESSAGE.CANCEL_EVENT_OK,
    true,
    httpStatus.OK,
    response
  );
};

const search = async (request, response) => {
  const arrayEvent = await eventService.searchEvents(request);

  for (let i = 0; i < arrayEvent.length; i++) {
    const category = await categoryService.FindOneById(arrayEvent[i].category);
    arrayEvent[i]._doc.categoryComplet = category;

    // remove all fileds don't need
    delete arrayEvent[i]._doc.category;
  }

  if (arrayEvent.length == 0) {
    const error = new Error('Event not found');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  return successF(
    'OK',
    arrayEvent,
    httpStatus.OK,
    response
  );
};

const validate = async (request, response) => {
  const { params } = request;
  const { event_id } = params;
  await eventService.validate(event_id);
  return successF(
    'Event validé',
    true,
    httpStatus.OK,
    response
  );
};

module.exports = {
  create,
  getAll,
  getDetailsEvent,
  submitParticipation,
  cancelParticipation,
  cancelEvent,
  search,
  getAllFiltered,
  validate,
};