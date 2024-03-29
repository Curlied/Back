/* eslint-disable no-unused-vars */
const { required } = require('joi');
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const types = mongoose.Schema.Types;

const eventModel = new mongoose.Schema({
  creator: {
    type: types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: types.String,
    required: true
  },
  category: {
    type: types.ObjectId,
    required: true,
    ref: 'Category'
  },
  date_time: {
    type: types.Date,
    required: true,
  },
  user_max: {
    type: types.Number,
    required: true
  },
  place: {
    type: types.String
  },
  time: {
    type: types.Number,
    required: true
  },
  price: {
    type: types.Number,
    required: true
  },
  description: {
    type: types.String,
    required: true
  },
  users_valide: [{
    user_id: types.ObjectId,
    _id: false
  }],
  users_waiting: [{
    user_id: types.ObjectId,
    _id: false
  }],
  users_refused: [{
    user_id: types.ObjectId,
    _id: false
  }],
  users_cancel: [{
    user_id: types.ObjectId,
    _id: false
  }],
  is_validate: {
    type: types.Boolean,
    default: true
  },
  created_at: {
    type: types.Date,
    default: new Date()
  },
  code: {
    type: types.String,
    required: true
  },
  department: {
    type: types.String,
    required: true
  },
  url_image: [String]
});

eventModel.plugin(paginate);
const Event = mongoose.model('Event', eventModel);

module.exports = Event;