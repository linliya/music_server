const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  role: { type: String, require: true },
  name: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: Number, require: true },
  tel: { type: String, require: true },
  email: { type: String, require: true }
});

let User = mongoose.model('User', userSchema);

module.exports = User;
