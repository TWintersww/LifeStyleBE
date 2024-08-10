//For simulating MDB connection via CLI
//Allows us to directly view/post from CLI

//Command syntax: node mongo.js <password>

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
// const url = `mongodb+srv://wuevan33:${password}@cluster0.xkaympk.mongodb.net/lifestyleApp?retryWrites=true&w=majority&appName=Cluster0`
// Bottom url used for testDB
const url = `mongodb+srv://wuevan33:${password}@cluster0.xkaympk.mongodb.net/testLifestyleApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const taskSchema = new mongoose.Schema({
  taskName: String,
  description: String,
  status: String,
  hoursSpent: Number,
  createDate: Date,
  user: mongoose.Schema.Types.ObjectId
})
const Task = mongoose.model('Task', taskSchema)

const task = new Task({
  taskName: "mongo.js task",
  description: "tester",
  status: "todo",
  hoursSpent: 0,
  createDate: new Date(),
  user: null
})
task.save().then(result => {
  console.log('task saved')
  mongoose.connection.close()
})

// Task.find({}).then(result => {
//   result.forEach(t => {
//     console.log(t)
//   })
//   mongoose.connection.close()
// })
