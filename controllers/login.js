const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  //FE sends username and password
  const { username, password } = request.body

  const userFound = await User.findOne({username})
  console.log('login.js | userFound:', userFound)
  const passwordCorrect = (userFound === null)
    ? false
    : await bcrypt.compare(password, userFound.passwordHash)

  console.log('login.js | passwordCorrect:', passwordCorrect)
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  //By this point, userFound can successfully log in

  //userForToken fields is for ease of BE confirmations in future FE requests
  const userForToken = {
    username: userFound.username,
    id: userFound._id
  }
  console.log('login.js | userForToken:', userForToken)

  const token = jwt.sign(
    userForToken, 
    config.SECRET,
    //token lasts for only 24 hrs. Then another login is required
    { expiresIn: '24h'}
  )
  console.log('login.js | token:', token)

  //username and name is for FE's ease of use
  response
    .status(200)
    .send({token, username: userFound.username, name: userFound.name})
})

module.exports = loginRouter
