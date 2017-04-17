const mongoose = require('mongoose');

let musicUploadSchema = new mongoose.Schema({
  userId: {type: String, require: true},
  name: { type: String, require: true },
  singer: { type: String, require: true},
  file: { type: Object, require: true}
});


let MusicUpload = mongoose.model('MusicUpload', musicUploadSchema);

module.exports = MusicUpload;
