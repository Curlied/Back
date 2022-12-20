/* eslint-disable no-unused-vars */
const catchAsync = require('../utils/catchAsync');
const eventService = require('../services/event.service');
const userService = require('../services/user.service');
const categoryService = require('../services/category.service');
const successF = require('../utils/success');
const constants = require('../utils/Constantes');
const errorF = require('../utils/error');
const httpStatus = require('http-status');

const create = catchAsync(async (req, res, next) => {
  try {
    await eventService.create(req);
    successF(constants.MESSAGE.CONFIRMATION_EVENT_ADD, true, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const validate = catchAsync(async (req, res, next) => {
  try {
    await eventService.validate(req);
    successF('Event validé', true, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const getAll = catchAsync(async (req, res, next) => {
  try {
    req.filter.is_validate = true;
    req.filter.date_time = {
      $gte: Date.now()
    };
    const result = await eventService.getAll(req);

    let arrayEvent = result;
    // let arrayEvent = result.docs;

    for (let i = 0; i < arrayEvent.length; i++) {
      const category = await categoryService.FindOneById(arrayEvent[i].category);
      arrayEvent[i]._doc.categoryComplet = category;
      arrayEvent[i]._doc.nbUserActual = arrayEvent[i].users.length;

      // remove all fileds don't need
      delete arrayEvent[i]._doc.description;
      delete arrayEvent[i]._doc.price;
      delete arrayEvent[i]._doc.time;
      delete arrayEvent[i]._doc.users;
      delete arrayEvent[i]._doc.is_validate;
      delete arrayEvent[i]._doc.category;
      delete arrayEvent[i]._doc.creator;
    }

    successF('OK', result, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const getAllFiltered = catchAsync(async (req, res, next) => {
  const events = await eventService.getAllFiltered(req);
  for (let i = 0; i < events.length; i++) {
    const category = await categoryService.FindOneById(events[i].category);
    events[i]._doc.categoryComplet = category;
    events[i]._doc.nbUserActual = events[i].users.length;

    // remove all fileds don't need
    delete events[i]._doc.description;
    delete events[i]._doc.price;
    delete events[i]._doc.time;
    delete events[i]._doc.users;
    delete events[i]._doc.is_validate;
    delete events[i]._doc.category;
    delete events[i]._doc.creator;
  }
  successF('OK', events, 200, res, next);
});

const getDetailsEvent = catchAsync(async (req, res, next) => {
  try {
    const event = await eventService.findOneById(req.params._id);
    const category = await categoryService.FindOneById(event.category);
    const usersIdArray = event.users.map(w => w.user_id);  

    let eventObject = event?.toObject();

    let filter ;
    if (req.CurrentUserIsAdmin == true) {
      eventObject.CurrentUserIsAdmin = true;
      filter= 'username telephone -_id'
    } else {
      eventObject.CurrentUserHasParticipant = req.CurrentUserHasParticipant;
      filter='username -_id'
    }

    const userParticipate = await userService.findManyById(usersIdArray, filter);
    const userCreator = await userService.findOne(event.creator, 'username -_id');

    eventObject.category = category?.toObject();
    eventObject.users = userParticipate.map(model => model.toObject());
    eventObject.creator = userCreator?.toObject();


    successF('OK', eventObject, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const submitParticipation = catchAsync(async (req, res, next) => {
  try {
    await eventService.submitParticipant(req);
    successF(constants.MESSAGE.DEMAND_PARTICIPATION_IS_OK, true, 200, res, next);
  } catch (error) {
    errorF(constants.MESSAGE.DEMAND_PARTICIPATION_IS_NOK, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const cancelParticipation = catchAsync(async (req, res, next) => {
  try {
    await eventService.cancelParticipant(req);
    successF(constants.MESSAGE.CANCEL_PARTICIPATION_ON_EVENT_OK, true, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const cancelEvent = catchAsync(async (req, res, next) => {
  try {
    const event = await eventService.cancelEvent(req.params._id);
    if (event.date_time.getFullYear() != 0) {
      var error = new Error('Une erreur est survenue pendant l\'annulation de l\'évènement');
      return errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
    }
    successF(constants.MESSAGE.CANCEL_EVENT_OK, true, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});

const search = catchAsync(async (req, res, next) => {
  try {
    const arrayEvent = await eventService.searchEvents(req);

    for (let i = 0; i < arrayEvent.length; i++) {
      const category = await categoryService.FindOneById(arrayEvent[i].category);
      arrayEvent[i]._doc.categoryComplet = category;

      // remove all fileds don't need
      delete arrayEvent[i]._doc.category;
    }

    if (arrayEvent.length == 0) {
      var error = new Error('Aucun évènement n\'à été trouvé avec cet recherche');
      return errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
    }
    successF('ok', arrayEvent, 200, res, next);
  } catch (error) {
    errorF(error.message, error, httpStatus.NOT_ACCEPTABLE, res, next);
  }
});
module.exports = {
  create,
  validate,
  getAll,
  getDetailsEvent,
  submitParticipation,
  cancelParticipation,
  cancelEvent,
  search,
  getAllFiltered
};