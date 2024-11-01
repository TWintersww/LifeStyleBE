// const logger = require('./logger')
// const jwt = require('jsonwebtoken')
// const config = require('./config')
// const User = require('../models/user')
import logger from './logger.js'
import jwt from 'jsonwebtoken'
import config from './config.js'
import User from '../models/user.js'

//request.token field gives token
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  // logger.info('tokenExtractor | authorization:', authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    const tokenString = authorization.replace('Bearer ', '')
    // logger.info('tokenExtractor | tokenString:', tokenString)
    request.token = tokenString
  }
  
  next()
}

//request.user field gives user document
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({error: 'token missing'})
  }
  //debugging code to inspect status of token
  const inspectToken= jwt.decode(request.token)
  // logger.info('inspectToken:', inspectToken)
  // logger.info('current time:', Math.floor(Date.now() / 1000))

  //if token parameter is null/invalid, throws JsonWebTokenError
  const decodedToken = jwt.verify(request.token, config.SECRET)
  //defensive programming to ensure payload structure
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }

  const loggedInUserId = decodedToken.id
  const loggedInUserDocument = await User.findById(loggedInUserId)

  if (!loggedInUserDocument) {
    return response.status(401).json({error: 'user not found'})
  }

  request.user = loggedInUserDocument

  next()
}

const requestLogger = (request, response, next) => {
  // logger.info('Method:', request.method)
  // logger.info('Path:  ', request.path)
  // logger.info('Body:  ', request.body)
  // logger.info('Token:  ', request.token)
  // logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  // logger.error(error.message)

  //For GET improperly formatted id
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  //For POST failed field validation
  else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  //For User POST duplicate username
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({error: `User with given username already exists`})
  }
  //For Tasks POST with null/invalid token parameter
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({error: 'token invalid'})
  }
  //When FE token expires 
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({error: 'token expired'})
  }

  next(error)
}

// module.exports = {
//   tokenExtractor,
//   userExtractor,
//   requestLogger,
//   unknownEndpoint,
//   errorHandler
// }
export default {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler
}
