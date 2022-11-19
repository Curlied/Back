const roleService = require('../services/role.service');

const create = async (req, res) => {
  // res.json(await roleService.create(req));
  res.json({});
};

const update = async (req, res) => {
  res.json(await roleService.update(req));
};

const getOne = async (req, res) => {
  res.json(await roleService.getOne(req));
};

const getAll = async (req, res) => {
  res.json(await roleService.getAll(req));
};

module.exports = {
  create,
  update,
  getOne,
  getAll
};