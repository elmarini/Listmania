const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {type: String, required: true, unique: false},
  state: {type: String, required: false, default:false},
  pic: {type: String, required: false},
  owner: {type: String, required: false}
}, {collection: 'items'});


//export model
module.exports = mongoose.model('Item', itemSchema);