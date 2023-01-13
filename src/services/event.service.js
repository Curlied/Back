const { Event } = require('../models');
const constantes = require('../utils/Constantes');
const { retrieve_user_from_token } = require('../middlewares/user.middleware');
const { getHeaderToken } = require('../utils/jwt');
const { convertDateStringToDate } = require('../utils/Constantes');

const create = async (user_id = '', event) => {
  event.date_time = convertDateStringToDate(event.date_time);
  event.creator = user_id;
  return Event.create(event);
};

const validate = async (event_id) => {
  const event = await Event.findOneAndUpdate({
    _id: event_id
  }, {
    $set: {
      is_validate: true
    }
  }, {
    new: true
  });
  return event;
};

const getAll = async () => {
  return await Event.find({ is_validate: true, date_time: { $gte: Date.now() } });
};

const getAllFiltered = async (filter = {}) => {
  return await Event.find(filter);
};

const findOneById = async (event_id) => {
  return await Event.findById(event_id);
};

const submitParticipant = async (user_id, event_id) => {
  const userParticipate = { user_id: user_id, status: constantes.STATUS_EVENT.VALIDATE };
  return await Event.updateOne(
    { _id: event_id },
    { $push: { users_waiting: userParticipate } });
};

const cancelParticipant = async (user_id, event_id) => {
  const userParticipate = { user_id: user_id };
  await Event.updateMany({ _id: event_id }, 
    { $pull: { 
      users_valide: userParticipate, 
      users_waiting: userParticipate } 
    }, 
    { 
      multi: true 
    })
  return await Event.updateOne(
    { _id: event_id },
    { $push: { users_cancel: userParticipate } });
};

const findAllByCreator = async (creator_id) => {
  const filter = {
    creator: creator_id,
    is_validate: true
  };
  return await Event.find(filter);
};

const findAllForSpaceUserByCreator = async (creator_id) => {
  const filter = { creator: creator_id };
  return await Event.find(filter).select('category date_time place name url_image users_valide users_waiting users_refused users_cancel user_max is_validate');
};

const findAllEventsUserParticpateIn = async (user_id) => {
  return await Event.find(
    { 
    $or: [
      { 'users_waiting.user_id': user_id },
      { 'users_valide.user_id': user_id }]
    }
  ).select('category date_time place name url_image users_valide users_waiting user_max');
};

const findAllByCreatorForMyProfil = async (_idCreator) => {
  const filter = { creator: _idCreator, is_validate: true };
  return await Event.find(filter).select('category date_time place name url_image');
};

const cancelEvent = async (event_id) => {
  const filter = { _id: event_id };
  let d = new Date().setFullYear(0);
  const update = { date_time: d };
  await Event.findOneAndUpdate(filter, update);
  return await Event.findOne(filter);
};

const IsUserAdminEvent = async (event_id, user_id) => {
  const filter = { _id: event_id, creator: user_id };
  const event = await Event.findOne(filter);
  if (!event) return false;
  return true;
};

const IsUserParticipeOnEvent = async (request) => {
  const { params } = request;
  const { event_id } = params;
  const { userId } = await retrieve_user_from_token(getHeaderToken(request));
  const event = await Event.findOne({
    _id: event_id,
    $or: [
      { 'users_waiting.user_id': userId },
      { 'users_valide.user_id': userId },
      { 'users_refused.user_id': userId },
      { 'users_cancel.user_id': userId }]
  });

  if (!event) return false;
  return true;
};

const hasPlaceToParticipeOnEvent = async (event_id) => {
  const event = await Event.findOne({ _id: event_id });
  // we check the number of user validate and waiting and we check if less than event_max
  return event.users_waiting.length + event.users_valide.length < event.user_max ? true : false;
};

const searchEvents = async (request) => {
  const { body } = request;
  const { category, department, code, date } = body;
  let filter = { is_validate: true };
  department ?? 'tous';
  if (category != 'tous') filter['category'] = category;
  if (department != 'tous') filter['department'] = department;
  if (code != null) filter['code'] = code;

  if (date === null) {
    filter['date_time'] = { $gte: Date.now() };
  }
  else {
    const dateMoinsUn = new Date(request.body.date);
    dateMoinsUn.setDate(dateMoinsUn.getDate() - 1);
    const datePlusUn = new Date(request.body.date);
    datePlusUn.setDate(datePlusUn.getDate() + 1);
    filter['date_time'] = { $gte: dateMoinsUn, $lt: datePlusUn };
  }

  return await Event.find(filter).select('category date_time url_image name');
};

module.exports = {
  create,
  validate,
  getAll,
  findOneById,
  submitParticipant,
  cancelParticipant,
  findAllByCreator,
  findAllEventsUserParticpateIn,
  findAllByCreatorForMyProfil,
  findAllForSpaceUserByCreator,
  cancelEvent,
  IsUserAdminEvent,
  IsUserParticipeOnEvent,
  hasPlaceToParticipeOnEvent,
  searchEvents,
  getAllFiltered
};