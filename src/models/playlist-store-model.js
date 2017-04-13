const mongoose = require('mongoose');

let playlistStoreSchema = new mongoose.Schema({
  userId: { type: String, require: true},
  id: {type: String, require: true},
  name: { type: String, require: true},
  author: { type: String, require: true},
  pic: { type: String, require: true},
  bg: { type: String, require: true},
  tracks: { type: Array, require: true},
  createTime: { type: String, require: true},
  playCount: { type: Number, require: true}
});

let PlaylistStore = mongoose.model('PlaylistStore', playlistStoreSchema);

module.exports = PlaylistStore;
