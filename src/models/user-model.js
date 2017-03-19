const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  role: { type: String},
  name: { type: String},
  username: { type: String, require: true },
  password: { type: String, require: true },
  tel: { type: String},
  email: { type: String}
});


let User = mongoose.model('User', userSchema);

module.exports = User;
