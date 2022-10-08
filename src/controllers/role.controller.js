const catchAsync = require('../utils/catchAsync');
const roleService = require('../services/role.service');

const create = catchAsync(async (req, res) => {
  res.json(await roleService.create(req));
});

const update = catchAsync(async (req, res) => {
  res.json(await roleService.update(req));
});

const getOne = catchAsync(async (req, res) => {
  res.json(await roleService.getOne(req));
});

const getAll = catchAsync(async (req, res) => {
  res.json(await roleService.getAll(req));
});


module.exports = {
  create,
  update,
  getOne,
  getAll
};