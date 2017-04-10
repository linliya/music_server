const mongoose = require('mongoose');

let musicSchema = new mongoose.Schema({
  id: {type: String, requird: true},
  name: { type: String, require: true },
  singer: { type: String, require: true},
  album: { type: String, require: true},
  playTime: { type: String, require: true},
  playUrl: { type: String, require: true},
  pic: {type: String, require: true}
});


let Music = mongoose.model('Music', musicSchema);

module.exports = Music;
