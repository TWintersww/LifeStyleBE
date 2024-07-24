const tasksRouter = require('express').Router()
const Task = require('../models/task')

tasksRouter.get('/', async (request, response) => {
  const tasks = await Task.find({})
  console.log('tasks.js | tasks:', tasks)
  response.json(tasks)
})
tasksRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  // console.log('type of id:', typeof id)

  const theTask = await Task.findById(id)
  console.log('tasks.js | theTask:', theTask)
  response.json(theTask)
})

tasksRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const result = await Task.findByIdAndDelete(id)
  if (!result) {
    console.log('no task deleted')
  }
  else {
    console.log('task deleted:', result)
  }
  response.status(204).end()
})

tasksRouter.post('/', async (request, response) => {
  //request.body made possible with express.json() middleware
  //which attaches json request data as js object in request.body
  const newTaskBody = request.body

  const newTask = new Task({
    taskName: newTaskBody.taskName,
    description: newTaskBody.description,
    status: newTaskBody.status,
    hoursSpent: newTaskBody.hoursSpent,
    createDate: newTaskBody.createDate,
  })

  const savedTask = await newTask.save()
  console.log('tasks.js | savedTask:', savedTask)
  response.status(201).json(savedTask)
})

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
  console.log('tasks.js | updatedTask:', updatedTask)
  response.json(updatedTask)
})

module.exports = tasksRouter
