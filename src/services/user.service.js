const { User } = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { date } = require('joi');
const SearchDefaultValue = 'username email';



const create = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 10);
  return User.create(userBody);
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

const findOneAndUpdateInformations = async (_id, user) => {
  try {
    const filter = {
      _id: _id
    };
    await User.findOneAndUpdate(filter, user);
    return true;
  }
  catch {
    return false;
  }

};




const findOne = async (_id, searchField = SearchDefaultValue) => {
  return await User.findById(_id).select(searchField);
};

const findManyById = async (_userid, searchField = SearchDefaultValue) => {
  return await User.find({ '_id': { $in: _userid } }).select(searchField);
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

const login = async (req) => {
  const {
    email,
    password
  } = req.body;

  const user = await User.findOne({
    email: email

  });



  if (!user) {
    return 'Invalid Credentiel';

  }
  const isCorrectPwd = await bcrypt.compare(req.body.password, user.password);
  if (isCorrectPwd == false) {

    return 'email or password incorrect';
  }

  const bearerToken = await jwt.sign({
    email: user.email,
    roles: user.roles,
    userId: user._id
  }, config.token.secret, { expiresIn: config.token.expire });

  const test = await compareAsync(password, user.password);
  if (test) {
    return { 'token': bearerToken, 'username': user.username };
  } else {
    return 'Invalid Credentiel';
  }
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
  findOneAndConfirm,
  findOne,
  findManyById,
  login,
  getAge,
  findManyUsersByUserArrayNoAsync,
  findOneAndUpdateInformations
};