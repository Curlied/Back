const { User } = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const SearchDefaultValue = 'username email';

const create = async (user_body) => {
  user_body.password = bcrypt.hashSync(user_body.password, 10);
  return User.create(user_body);
};

const findOneAndUpdate = async (email_user) => {
  const filter = {
    email: email_user
  };
  const update = {
    is_validate: true
  };
  await User.findOneAndUpdate(filter, update);
  let user = await User.findOne(filter);
  return user;
};

const findOne = async (user_id, searchField = SearchDefaultValue) => {
  return await User.findById(user_id).select(searchField);
};

const findManyById = async (user_id, searchField = SearchDefaultValue) => {
  return await User.find({ '_id': { $in: user_id } }).select(searchField);
};

const findManyUsersByUserArrayNoAsync = (_userArrayId, searchField = SearchDefaultValue) => {

  return User.find({ '_id': { $in: _userArrayId } }).select(searchField);
};

const compareAsync = (param1, param2) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, param2, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return false;

  const isCorrectPwd = await bcrypt.compare(password, user.password);
  if (!isCorrectPwd) return false;

  const accessToken = await jwt.sign({
    email: user.email,
    roles: user.roles,
    userId: user._id
  }, config.token.secret, { expiresIn: config.token.expire });

  const test = await compareAsync(password, user.password);
  if (!test) return false;
  return { token: accessToken, username: user.username };
};

const getAge = (birth_date) => {
  var now = new Date();
  var current_year = now.getFullYear();
  var year_diff = current_year - birth_date.getFullYear();
  var birthday_this_year = new Date(current_year, birth_date.getMonth(), birth_date.getDate());
  var has_had_birthday_this_year = (now >= birthday_this_year);

  return has_had_birthday_this_year
    ? year_diff
    : year_diff - 1;
};

module.exports = {
  create,
  findOneAndUpdate,
  findOne,
  findManyById,
  login,
  getAge,
  findManyUsersByUserArrayNoAsync
};