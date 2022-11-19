const categoryService = require('../services/category.service');
const errorF = require('../utils/error');
const successF = require('../utils/success');

const create = async (request, response) => {
  try {
    const category = await categoryService.create(request);
    successF('La catégorie à bien été créée', category, 200, response);
  } catch (error) {
    errorF('Une erreure est survenue lors de la création de la catégorie', error, 500, response);
  }
};

const update = async (request, response) => {
  try {
    const category = await categoryService.update(request);
    successF('La catégorie à bien été créée', category, 200, response);
  } catch (error) {
    errorF('Une erreure est survenue lors de la modification de la catégorie', error, 500, response);
  }
};

const getOne = async (request, response) => {
  try {
    const category = await categoryService.getOne(request);
    successF('OK', category, 200, response);
  } catch (error) {
    errorF(error.message, error, 500, response);
  }
};

const getAll = async (request, response) => {
  try {
    const categories = await categoryService.getAll(request);
    successF('OK', categories, 200, response);
  } catch (error) {
    errorF(error.message, error, 500, response);
  }
};

module.exports = {
  create,
  update,
  getOne,
  getAll
};