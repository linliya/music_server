const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  role: { type: String},
  name: { type: String},
  username: { type: String, require: true },
  password: { type: String, require: true },
  photo: {type: String, require: true},
  intro: {type: String, require: true},
  birthday: {type: String, require: true},
  sex: {type: String, require: true},
  area: {type: String, require: true},
  tel: { type: String},
  email: { type: String}
});


let User = mongoose.model('User', userSchema);

module.exports = User;
