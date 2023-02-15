const pagination = require('../utils/pagination');

const {
  Role
} = require('../models');

const create = async (body) => {
  return Role.create(body);
};

const update = async (role_id, role_body) => {
  const role = await Role.findOneAndUpdate({
    _id: role_id
  }, role_body, {
    new: true
  });
  return role;
};

const getOne = async (role_id) => {
  const role = await Role.findOne({
    _id: role_id
  });
  return role;
};

const getAll = async (search, filter, page, size) => {
  return await pagination(Role, search, filter, page, size);
};

module.exports = {
  create,
  update,
  getOne,
  getAll
};