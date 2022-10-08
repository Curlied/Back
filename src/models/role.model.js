const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const types = mongoose.Schema.Types;

const roleSchema = new mongoose.Schema({
  name: {
    type: types.String,
    required: true
  },
  versionKey: false
});

roleSchema.plugin(paginate);
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;