const config = require('./utils/config')
const corsMiddleware = require('./utils/corsConfig')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

logger.info('connecting to', config.MONGODB_URL)
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URL)
  .then(result => {
    logger.info('connected to MDB')
  })
  .catch(error => {
    logger.info('error connecting to MDB:', error.message)
  })


app.use(corsMiddleware)
app.use(express.json())
app.use(middleware.requestLogger)

//Eliminates need for try/catch in router async calls
require('express-async-errors')
const tasksRouter = require('./controllers/tasks')
app.use('/api/tasks', tasksRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
