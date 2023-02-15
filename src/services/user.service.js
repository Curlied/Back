const { User } = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const SearchDefaultValue = 'username email';

const create = async (user_body) => {
  user_body.password = bcrypt.hashSync(user_body.password, 10);
  return User.create(user_body);
};

const findOneAndConfirm = async (email_user) => {
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
  return await User.findById({ _id: user_id }).select(searchField);
};

const findManyById = async (user_id, searchField = SearchDefaultValue) => {
  return await User.find({ '_id': { $in: user_id } }).select(searchField);
};

const findManyUsersByUserArrayNoAsync = (_userArrayId, searchField = SearchDefaultValue) => {

  return User.find({ '_id': { $in: _userArrayId } }).select(searchField);
};

const compareAsync = (param1, param2) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, param2, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return { token: '', username: '' };

  const isCorrectPwd = await bcrypt.compare(password, user.password);
  if (!isCorrectPwd) return { token: '', username: user.username };

  const bearerToken = await jwt.sign({
    email: user.email,
    roles: user.roles,
    userId: user._id
  }, config.token.secret, { expiresIn: config.token.expire });

  const test = await compareAsync(password, user.password);
  if (!test) return { token: '', username: user.username };
  return { token: bearerToken, username: user.username };
};

const getAge = (birth_date) => {
  const now = new Date();
  const current_year = now.getFullYear();
  const year_diff = current_year - birth_date.getFullYear();
  const birthday_this_year = new Date(current_year, birth_date.getMonth(), birth_date.getDate());
  const has_had_birthday_this_year = (now >= birthday_this_year);

  return has_had_birthday_this_year
    ? year_diff
    : year_diff - 1;
};

const findOneAndUpdateInformations = async (id, user) => {
  try {
    const filter = {
      _id: id
    };
    const _user = await User.findOneAndUpdate(filter, user);
    return _user;
  }
  catch {
    return false;
  }

};

module.exports = {
  create,
  findOneAndConfirm,
  findOne,
  findManyById,
  login,
  getAge,
  findManyUsersByUserArrayNoAsync,
  findOneAndUpdateInformations
};