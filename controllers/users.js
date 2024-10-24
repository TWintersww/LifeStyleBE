// const bcrypt = require('bcrypt')
// const usersRouter = require('express').Router()
// const User = require('../models/user')
// const logger = require('../utils/logger')
import bcrypt from 'bcrypt'
import express from 'express'
const usersRouter = express.Router()
import User from '../models/user.js'
import logger from '../utils/logger.js'

//creation of new user
usersRouter.post('/', async (request, response) => {
  //FE sends password, which we encrypt here
  const { username, name, password } = request.body

  if (!password || password.length < 8) {
    return response.status(400).json({error: 'Password must be at least 8 characters long.'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })
  // logger.info('users.js | newUser:', newUser)
  const savedUser = await newUser.save()
  // logger.info('users.js | savedUser:', savedUser)

  response.status(201).json(savedUser)
}) 

//getting all users
usersRouter.get('/', async (request, response) => {
  const allUsers = await User
    .find({}).populate('tasks', {taskName: 1, description: 1, status: 1, hoursSpent: 1, createDate: 1})
  // logger.info('users.js | allUsers:', allUsers)
  response.json(allUsers)
})

// module.exports = usersRouter
export default usersRouter
