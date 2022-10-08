const pagination = require('../utils/pagination');

const {
  Role
} = require('../models');

const create = async (req) => {
  return Role.create(req.body);
};

const update = async (req) => {
  const {
    _id
  } = req.params;
  const role = await Role.findOneAndUpdate({
    _id: _id
  }, req.body, {
    new: true
  });
  return role;
};

const getOne = async (req) => {
  const {
    _id
  } = req.params;
  const role = await Role.findOne({
    _id: _id
  });
  return role;
};

const getAll = async (req) => {
  return await pagination(Role, req);
};

module.exports = {
  create,
  update,
  getOne,
  getAll
};