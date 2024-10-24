// const mongoose = require('mongoose')
import mongoose from 'mongoose'

/*
Post:
  String title
  String summary
  String coverimg (as path)
  String content
  User user
*/
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 1,
    required: true
  },
  summary: String,
  coverimg: String,
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})
postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// module.exports = mongoose.model('Post', postSchema)
export default mongoose.model('Post', postSchema)
