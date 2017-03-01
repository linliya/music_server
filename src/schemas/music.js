var mongoose = require('mongoose')

var MusicSchema = new mongoose.Schema({
  title: String,
  singer: String,
  language: String,
  poster: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MusicSchema.pre('save', function() {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

MusicSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({_id:id})
      exec(cb)
  }
}

module.exports = MusicSchema
