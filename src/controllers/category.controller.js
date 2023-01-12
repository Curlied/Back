const httpStatus = require('http-status');
const categoryService = require('../services/category.service');
const successF = require('../utils/success');
const errorF = require('../utils/error');

const create = async (request, response) => {
  const { body } = request;
  const { category: category_created, error } = await categoryService.create(body);
  if (error) {
    return errorF(error, httpStatus.CONFLICT, response);
  }
  return successF('created', category_created, httpStatus.CREATED, response);
};

const update = async (request, response) => {
  const { body, params } = request;
  const { category_id } = params;
  const category = await categoryService.update(category_id, body);
  if (!category) {
    const error = new Error('Category not found');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  return successF(`${category._id}`, category, httpStatus.OK, response);
};

const getOne = async (request, response) => {
  const { params } = request;
  const { category_id } = params;
  const category = await categoryService.getOne(category_id);
  if (!category) {
    const error = new Error('Category not found');
    return errorF(error, httpStatus.NOT_FOUND, response);
  }
  return successF('OK', category, httpStatus.OK, response);
};

const getAll = async (request, response) => {
  const categories = await categoryService.getAll(request) || [];
  return successF('OK', categories, httpStatus.OK, response);
};

module.exports = {
  create,
  update,
  getOne,
  getAll
};