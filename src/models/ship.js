const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  userId: { type: ObjectId, ref: 'User' },
  shipType: String,
  positions: [Number],
  gameNumber: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ship', schema);
