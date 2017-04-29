const mongoose = require('mongoose');

let playlistStoreSchema = new mongoose.Schema({
  id: { type: String, require: true},
  userId: { type: String, require: true},
  result: { type: Object, require: true},
  name: {type: String,require: true}
});

let PlaylistStore = mongoose.model('PlaylistStore', playlistStoreSchema);

module.exports = PlaylistStore;
