const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  userPic: { type: String, required: false, unique: true },
  createdAt: { type: Date, expires: 100000000, default: Date.now },
  updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Session', sessionSchema);