const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  username: {
    type: types.String,
    required: true,
  },
  password: {
    type: types.String,
    required: true,
  },
  birth_date: {
    type: types.Date,
    required: true,
  },
  telephone: {
    type: types.String,
    required: true,
  },
  url_image: {
    type: types.String,
  },
  roles: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
      },
    ],
    default: ['619f7447336ed5a57ab8974b'],
  },
  is_validate: {
    type: types.Boolean,
    required: true,
    default: false,
  },
  email: {
    type: types.String,
    required: true,
    unique: true,
  },
  description: {
    type: types.String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
