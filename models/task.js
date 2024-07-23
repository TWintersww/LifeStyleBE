const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    minLength: 1,
    required: true
  },
  description: String,
  status: String,
  createDate: Date,
})
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)
