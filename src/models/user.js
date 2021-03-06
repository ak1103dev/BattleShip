const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  username: String,
  userType: String,
  gameNumber: Number
});

module.exports = mongoose.model('User', schema);
