const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
console.log('connecting to', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MDB')
  })
  .catch(error => {
    console.log('error connecting to MDB:', error.message)
  })



const taskSchema = new mongoose.Schema({
  taskName: String,
  description: String,
  status: String,
})
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)
