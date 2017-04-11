const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  id: {type: String, requird: true},
  comment: { type: String, require: true },
  commentUser: {type: String, require: true},
  commentTime: {type: String, require: true},
  commentUserPhoto: {type: String, require: true}
});


let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
