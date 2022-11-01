const { Event } = require('../models');
const pagination = require('../utils/pagination');
const constantes = require('../utils/Constantes');

const create = async (req) => {
  req.body.creator = req.user.userId;
  return Event.create(req.body);
};

const validate = async (req) => {
  const {
    _id
  } = req.params;
  const event = await Event.findOneAndUpdate({
    _id: _id
  }, {
    $set: {
      is_validate: true
    }
  }, {
    new: true
  });
  return event;
};

const getAllPagination = async (req) => {
  return await pagination(Event, req);
};

const getAll = async (req) => {
  return await Event.find({ is_validate: true, date_time: { $gte: Date.now() } });
};

const getAllFiltered = async (req) => {
  const filter = req.filter;
  return await Event.find(req.filter);
};

const findOneById = async (_id) => {
  return await Event.findById(_id);
};

const submitParticipant = async (req) => {
  var userParticipate = { user_id: req.user.userId, status: constantes.STATUS_EVENT.VALIDATE };
  return await Event.updateOne(
    { _id: req.body.event_id },
    { $push: { users: userParticipate } });
};

const cancelParticipant = async (req) => {
  var userParticipate = { user_id: req.user.userId };
  return await Event.updateOne(
    { _id: req.body.event_id },
    { $pull: { users: userParticipate } });
};

// eslint-disable-next-line no-unused-vars
const updateStatusParticipant = async (req) => {

};

const findAllByCreator = async (_idCreator) => {
  const filter = { creator: _idCreator, is_validate: true };
  return await Event.find(filter);
};

const findAllForSpaceUserByCreator = async (_idCreator) => {
  const filter = { creator: _idCreator };
  return await Event.find(filter).select('category date_time place name url_image users user_max is_validate');
};

const findAllEventsUserParticpateIn = async (req) => {
  return await Event.find({ 'users.user_id': req.user.userId }).select('category date_time place name url_image users user_max');
};

const findAllByCreatorForMyProfil = async (_idCreator) => {
  const filter = { creator: _idCreator, is_validate: true };
  return await Event.find(filter).select('category date_time place name url_image');
};

const cancelEvent = async (_idevent) => {
  const filter = { _id: _idevent };
  let d = new Date().setFullYear(0);
  const update = { date_time: d };
  await Event.findOneAndUpdate(filter, update);
  return await Event.findOne(filter);
};

const IsUserAdminEvent = async (req) => {
  const filter = { _id: req.params._id, creator: req.user.userId };
  const event = await Event.findOne((filter));
  return event ? true : false;
};

const IsUserParticipeOnEvent = async (req) => {
  const event = await Event.findOne({ _id: req.params._id, 'users.user_id': req.user.userId });
  return event ? true : false;
};

const hasPlaceToParticipeOnEvent = async (req) => {
  const event = await Event.findOne({ _id: req.params._id });
  return event.users.length < event.user_max ? true : false;
};

const searchEvents = async (req) => {

  let filter = { is_validate: true };
  req.body.department ?? 'tous';
  if (req.body.category != 'tous') filter['category'] = req.body.category;
  if (req.body.department != 'tous') filter['department'] = req.body.department;
  if (req.body.code != null) filter['code'] = req.body.code;

  if (req.body.date == null) {
    filter['date_time'] = { $gte: Date.now() };
  }
  else {
    const dateMoinsUn = new Date(req.body.date);
    dateMoinsUn.setDate(dateMoinsUn.getDate() - 1);
    const datePlusUn = new Date(req.body.date);
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