const mongoose = require('mongoose');

let playlistSchema = new mongoose.Schema({
  id: {type: String, require: true},
  name: { type: String, require: true },
  author: { type: String, require: true},
  pic: { type: String, require: true}
});


let Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
