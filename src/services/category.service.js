const { Category } = require('../models');
const pagination = require('../utils/pagination');

const create = async (body) => {
  return Category.create(body);
};

const getAll = async (search, filter, page, size) => {
  return await pagination(Category, search, filter, page, size);
};

const update = async (category_id, body) => {
  const category = await Category.findOneAndUpdate({
    _id: category_id
  }, body, {
    new: true
  });
  return category;
};

const getOne = async (object_id) => {
  const category = await Category.findOne({
    _id: object_id
  });
  return category;
};
const FindOneById = async (object_id) => {
  return await Category.findById(object_id).select('-_id name url_icon url_image');
};

module.exports = {
  create,
  update,
  getOne,
  getAll,
  FindOneById
};