const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const types = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema({
  name: {
    type: types.String,
    required: true,
    unique: true
  },
  description: {
    type: types.String,
    required: true
  },
  url_image: {
    type: types.String,
    required: true
  },
  url_icon:{
    type: types.String,
    required: true
  },
  versionKey: false
});

categorySchema.plugin(paginate);
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;