// const mongoose = require('mongoose')
import mongoose from 'mongoose'

/*
User:
  String username
  String name
  String passwordHash
  Task[] tasks
*/
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    //unique throws MongoServerError, not ValidationError
    unique: true,
  },
  name: String,
  // email: String,
  passwordHash: String,

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    //do not reveal passwordHash
    delete returnedObject.passwordHash
  }
})

// module.exports = mongoose.model('User', userSchema)
export default mongoose.model('User', userSchema)
