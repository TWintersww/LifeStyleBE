require('dotenv').config()
const corsMiddleware = require('./utils/corsConfig')
const express = require('express')
const app = express()

const Task = require('./models/task')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(corsMiddleware)
app.use(express.json())
app.use(requestLogger)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/tasks', (request, response) => {
  Task.find({}).then(t => 
    response.json(t)
  )
})
app.get('/api/tasks/:id', (request, response, next) => {
  const id = request.params.id
  // console.log('type of id:', typeof id)

  Task.findById(id)
    .then(t => {
      if (t) {
        response.json(t)
      }
      else {
        //rightly formatted id, but not found
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/tasks/:id', (request, response, next) => {
  const id = request.params.id
  Task.findByIdAndDelete(id)
    .then(result => {
      if (!result) {
        console.log('no task deleted')
      }
      else {
        console.log('task deleted:', result)
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/tasks', (request, response) => {
  //request.body made possible with express.json() middleware
  //which attaches json request data as js object in request.body
  const newTaskBody = request.body

  if (!newTaskBody.taskName) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const newTask = new Task({
    taskName: newTaskBody.taskName,
    description: newTaskBody.description,
    status: newTaskBody.status,
  })

  newTask.save().then(savedTask => {
    console.log('savedTask:', savedTask)
    response.json(savedTask)
  })
})

app.put('/api/tasks/:id', (request, response, next) => {
  const id = request.params.id
  const editedTaskBody = request.body

  if (!editedTaskBody.taskName) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const editedTask = {
    taskName: editedTaskBody.taskName,
    description: editedTaskBody.description,
    status: editedTaskBody.status,
  }

  Task.findByIdAndUpdate(id, editedTask, {new: true})
    .then(updatedTask => {
      console.log('updatedTask:', updatedTask)
      response.json(updatedTask)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
