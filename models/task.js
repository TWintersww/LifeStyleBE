// const mongoose = require('mongoose')
import mongoose from 'mongoose'

/*
Task: 
  String taskName
  String description
  String status -> 'todo' or 'completed'
  String hoursSpent -> whole or decimal Number as string
  String createDate -> date as ISO string (UTC time)
  User user
*/
const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    minLength: 1,
    required: true
  },
  description: String,
  status: String,
  hoursSpent: Number,
  createDate: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// module.exports = mongoose.model('Task', taskSchema)
export default mongoose.model('Task', taskSchema)
