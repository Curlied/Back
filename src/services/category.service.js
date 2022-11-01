const { Category } = require('../models');
const pagination = require('../utils/pagination');


const create = async (req) => {
  return Category.create(req.body);
};

const getAll = async (req) => {
  return await pagination(Category, req);
};

const update = async (req) => {
  const {
    _id
  } = req.params;
  const category = await Category.findOneAndUpdate({
    _id: _id
  }, req.body, {
    new: true
  });
  return category;
};

const getOne = async (req) => {
  const {
    _id
  } = req.params;
  const category = await Category.findOne({
    _id: _id
  });
  return category;
};
const FindOneById = async (_id) => {
  return await Category.findById(_id).select('-_id name url_icon url_image');
};


module.exports = {
  create,
  update,
  getOne,
  getAll,
  FindOneById
};