const express = require('express')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)

let tasks = [
      {
        taskName: "leetcode",
        description: "lc50",
        status: 'todo',
        id: '1'
      },
      {
        taskName: 'webdev',
        description: 'fso part 5',
        status: 'todo',
        id: '2'
      },
      {
        taskName: 'linkedin',
        description: 'add connections',
        status: 'completed',
        id: '3'
      },
      {
        taskName: 'veryveryverylonglonglonglongname',
        description: 'veryveryverylongdescription veryveryverylongdescription veryveryverylongdescriptionveryveryverylongdescription veryveryverylongdescription veryveryverylongdescription',
        status: 'completed',
        id: '4'
      }
    ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/tasks', (request, response) => {
  response.json(tasks)
})
app.get('/api/tasks/:id', (request, response) => {
  const id = request.params.id
  // console.log('type of id:', typeof id)

  const task = tasks.find(t => t.id === id)

  if (task) {
    response.json(task)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/tasks/:id', (request, response) => {
  const id = request.params.id
  tasks = tasks.filter(t => t.id !== id)

  response.status(204).end()
})

app.post('/api/tasks', (request, response) => {
  //request.body made possible with express.json() middleware
  //which attaches json request data as js object in request.body
  const newTask = request.body

  if (!newTask.taskName) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const maxId = tasks.length > 0
    ? Math.max(...tasks.map(t => Number(t.id)))
    : 0
  newTask.id = String(maxId + 1)

  tasks = tasks.concat(newTask)
  response.json(newTask)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
