const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Task = require('../models/task')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helpers = require('./test_helpers')


const api = supertest(app)

// describe('2 notes & 1 user saved', () => {
//   beforeEach(async () => {
//     await Task.deleteMany({})
//     await User.deleteMany({})
    
//     const taskObjects = helpers.initialTasks.map(t => new Task(t))
//     const promiseArray = taskObjects.map(t => t.save())
//     await Promise.all(promiseArray)
  
//     const passwordHash = await bcrypt.hash('p1', 10)
//     let userObject = new User({name: "u1", username: "u1", passwordHash})
//     await userObject.save()
//   })

//   test('tasks returned as json', async() => {
//     await api
//       .get('/api/tasks')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   })
  
//   test('all tasks returned', async() => {
//     const response = await api.get('/api/tasks')
  
//     assert.strictEqual(response.body.length, helpers.initialTasks.length)
//   })
  
//   test('a specific task is within the returned tasks', async() => {
//     const response = await api.get('/api/tasks')
//     const taskNames = response.body.map(t => t.taskName)
//     // console.log(taskNames)
  
//     assert(taskNames.includes('Leetcode'))
//   })

//   describe('adding a new note', () => {
//     test('post request without token fails', async() => {
//       const newTask = {
//         description: "abcd",
//         status: "todo",
//         hoursSpent: 0,
//         createDate: new Date()
//       }
    
//       const errorResponse = await api
//         .post('/api/tasks')
//         .send(newTask)
//         .expect(401)
    
//       assert.strictEqual(errorResponse.body.error, 'token missing')
    
//       const tasksResponse = await api.get('/api/tasks')
    
//       assert.strictEqual(tasksResponse.body.length, helpers.initialTasks.length)
//     })
    
//     test('task without taskName not added', async() => {
//       const usersAtStart = await User.find({})
//       const user = usersAtStart[0]
    
//       const userForToken = {username: user.username, id: user._id}
//       const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})
    
//       const newTask = {
//         description: "abcd",
//         status: "todo",
//         hoursSpent: 0,
//         createDate: new Date()
//       }
    
//       const errorResponse = await api
//         .post('/api/tasks')
//         .set('Authorization', `Bearer ${token}`)
//         .send(newTask)
//         .expect(400)
    
//       // console.log(errorResponse.body.error)
//       assert(errorResponse.body.error.includes('validation failed'))
    
//       const tasksResponse = await api.get('/api/tasks')
    
//       assert.strictEqual(tasksResponse.body.length, helpers.initialTasks.length)
//     })
    
//     test('valid task can be added', async() => {
//       const usersAtStart = await User.find({})
//       const user = usersAtStart[0]
//       const userIdString = user._id.toString()
    
//       const userForToken = {username: user.username, id: user._id}
//       const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})
    
//       const newTask = {
//         taskName: "abcd",
//         description: "abcd",
//         status: "todo",
//         hoursSpent: 0,
//         createDate: new Date()
//       }
    
//       const postResponse = await api
//         .post('/api/tasks')
//         .set('Authorization', `Bearer ${token}`)
//         .send(newTask)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)
      
    
//       const response = await api.get('/api/tasks')
    
//       const taskNames = response.body.map(t => t.taskName)
    
//       assert.strictEqual(response.body.length, helpers.initialTasks.length + 1)
//       assert(taskNames.includes('abcd'))
//       //new task's user field matches user._id
//       assert.strictEqual(postResponse.body.user, userIdString)
//     })
//   })

//   describe('deleting a note', () => {
//     test('a task can be deleted', async() => {
//       const startResponse = await api.get('/api/tasks')
//       const tasksAtStart = startResponse.body
//       const theTask = tasksAtStart[0];
//       // console.log('theTask:', theTask)
    
//       await api
//         .delete(`/api/tasks/${theTask.id}`)
//         .expect(204)
    
//       const endResponse = await api.get('/api/tasks')
//       const tasksAtEnd = endResponse.body
//       const taskNames = tasksAtEnd.map(t => t.taskName)
    
//       assert(!taskNames.includes(theTask.taskName))
    
//       assert.strictEqual(tasksAtEnd.length, helpers.initialTasks.length - 1)
//     })
//   })





// })

describe('authentication and permissions', () => {
  let user1
  let user2

  beforeEach(async () => {
    await Task.deleteMany({})
    await User.deleteMany({})
  
    let passwordHash = await bcrypt.hash('p1', 10)
    let userObject = new User({name: "u1", username: "u1", passwordHash})
    user1 = await userObject.save()

    passwordHash = await bcrypt.hash('p2', 10)
    userObject = new User({name: "u2", username: "u2", passwordHash})
    user2 = await userObject.save()

    const taskObjects = helpers.initialTasks.map(t => {
      let taskObject = new Task(t)
      taskObject.user = user1._id
      return taskObject
    })
    const promiseArray = taskObjects.map(t => t.save())
    await Promise.all(promiseArray)
  })

  describe('login router tests', () => {
    test('invalid username', async() => {
      const username = 'invalid'
      const password = 'p1'

      const response = await api
        .post('/api/login')
        .send({username, password})
        .expect(401)

      assert.strictEqual(response.body.error, 'Invalid username or password')
    })
    test('invalid password', async() => {
      const username = 'u1'
      const password = 'invalid'

      const response = await api
        .post('/api/login')
        .send({username, password})
        .expect(401)

      assert.strictEqual(response.body.error, 'Invalid username or password')
    })
    test('correct username and password', async() => {
      const username = 'u1'
      const password = 'p1'

      const response = await api
        .post('/api/login')
        .send({username, password})
        .expect(200)

      // console.log(response.body)
      assert.ok(response.body.token)
    })
  })

  describe('authentication tests', () => {
    test('initialTasks owned and only visible to u1', async() => {
      const user1IdString = user1._id.toString()
      
      const userForToken = {username: user1.username, id: user1._id}
      const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})
      const response = await api
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)


      for (const task of response.body) {
        // console.log(task.user.id, user1IdString)
        assert.strictEqual(task.user.id, user1IdString)
      }
    })
    test('initialTasks invisible to u2', async() => {
      const user2IdString = user2._id.toString()
      
      const userForToken = {username: user2.username, id: user2._id}
      const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})
      const response = await api
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)

      // console.log(response.body)

      assert.strictEqual(response.body.length, 0)
    })
    
  })
})


// npm test -- --test-only



after(async() => {
  await mongoose.connection.close
})
