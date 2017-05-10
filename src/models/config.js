const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  gameNumber: Number
});

module.exports = mongoose.model('Config', schema);
