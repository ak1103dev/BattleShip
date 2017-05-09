const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  username: String,
  userType: String,
});

module.exports = mongoose.model('User', schema);
