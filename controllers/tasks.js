const tasksRouter = require('express').Router()
const Task = require('../models/task')
const userExtractor = require('../utils/middleware').userExtractor
const logger = require('../utils/logger')


tasksRouter.get('/', userExtractor, async (request, response) => {
  const loggedInUserDocument = request.user
  console.log(loggedInUserDocument)

  const tasks = await Task
    .find({user: loggedInUserDocument._id}).populate('user', {username: 1, name: 1})
  logger.info('tasks.js | tasks:', tasks)
  response.json(tasks)
})
// tasksRouter.get('/:id', async (request, response) => {
//   const id = request.params.id
//   // console.log('type of id:', typeof id)

//   const theTask = await Task.findById(id)
//   console.log('tasks.js | theTask:', theTask)
//   response.json(theTask)
// })

//For admin purposes only
tasksRouter.delete('/clearAll', async (request, response) => {
  await Task.deleteMany({})
  logger.info('clearAll called')
  response.status(204).end()
})

//Implement a user token check before deletion
tasksRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const result = await Task.findByIdAndDelete(id)
  if (!result) {
    logger.info('no task deleted')
  }
  else {
    logger.info('task deleted:', result)
  }
  response.status(204).end()
})

tasksRouter.post('/', userExtractor, async (request, response) => {
  //request.body made possible with express.json() middleware
  //which attaches json request data as js object in request.body
  const newTaskBody = request.body
  const loggedInUserDocument = request.user
  logger.info('tasks.js | loggedInUserDocument:', loggedInUserDocument)

  const newTask = new Task({
    taskName: newTaskBody.taskName,
    description: newTaskBody.description,
    status: newTaskBody.status,
    hoursSpent: newTaskBody.hoursSpent,
    createDate: newTaskBody.createDate,
    //.id for Document instance is 'virtual getter'.
    //automatically casts ObjectId to String representation
    user: loggedInUserDocument.id
  })

  const savedTask = await newTask.save()
  logger.info('tasks.js | savedTask:', savedTask)

  loggedInUserDocument.tasks = loggedInUserDocument.tasks.concat(savedTask._id)
  logger.info('tasks.js | updated loggedInUserDocument.tasks:', loggedInUserDocument.tasks)
  await loggedInUserDocument.save()

  response.status(201).json(savedTask)
})

//NEEDS UPDATE TO BE ON TRACK WITH USER HANDLING
tasksRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const {taskName, description, status, hoursSpent, createDate} = request.body

  const editedTask = {
    taskName,
    description,
    status,
    hoursSpent,
    createDate
  }

  const updatedTask = await Task.findByIdAndUpdate(id, editedTask, {new: true, runValidators: true, context: 'query'})
  logger.info('tasks.js | updatedTask:', updatedTask)
  response.json(updatedTask)
})

module.exports = tasksRouter
