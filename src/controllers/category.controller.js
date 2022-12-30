const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');
const errorF = require('../utils/error');
const successF = require('../utils/success');

const create = catchAsync(async (req, res, next) => {
  try {
    const category = await categoryService.create(req);
    successF('La catégorie à bien été créée', category, 200, res, next);
  } catch (error) {
    errorF('Une erreure est survenue lors de la création de la catégorie', error, 500, res, next);
  }
});

const update = catchAsync(async (req, res, next) => {
  try {
    const category = await categoryService.update(req);
    successF('La catégorie à bien été mise à jour', category, 200, res, next);
  } catch (error) {
    errorF('Une erreure est survenue lors de la modification de la catégorie', error, 500, res, next);
  }
});

const getOne = catchAsync(async (req, res, next) => {
  try {
    const category = await categoryService.getOne(req);
    successF('OK', category, 200, res, next);
  } catch (error) {
    errorF(error.message, error, 500, res, next);
  }
});

const getAll = catchAsync(async (req, res, next) => {
  try {
    const categories = await categoryService.getAll(req);
    successF('OK', categories, 200, res, next);
  } catch (error) {
    errorF(error.message, error, 500, res, next);
  }
});

module.exports = {
  create,
  update,
  getOne,
  getAll
};