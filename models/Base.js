const mongoose = require('mongoose');
const BaseSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = mongoose.model('Base', BaseSchema);
