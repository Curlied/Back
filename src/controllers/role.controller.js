const httpStatus = require('http-status');
const roleService = require('../services/role.service');
const successF = require('../utils/success');
const errorF = require('../utils/error');

const create = async (request, response) => {
  const { body } = request;
  return response.json(await roleService.create(body));
};

const update = async (request, response) => {
  const { body, params } = request;
  const { role_id } = params;
  const role = await roleService.update(role_id, body);
  if (!role) {
    const error = new Error('Role not found');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  return successF('OK', role, httpStatus.OK, response);
};

const getOne = async (request, response) => {
  const { params } = request;
  const { role_id } = params;
  const role = await roleService.getOne(role_id);
  if (!role) {
    const error = new Error('Role not found');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  return successF('OK', role, httpStatus.OK, response);
};

const getAll = async (request, response) => {
  const { query } = request;
  const { name, page, size } = query;

  const search = {};
  if (name) search.name = name;
  const filter = ['name'];
  const roles = await roleService.getAll(search, filter, page, size) || [];
  return successF('OK', roles, httpStatus.OK, response);
};

module.exports = {
  create,
  update,
  getOne,
  getAll
};