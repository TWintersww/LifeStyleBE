// const config = require('./utils/config')
// const corsMiddleware = require('./utils/corsConfig')
// const middleware = require('./utils/middleware')
// const logger = require('./utils/logger')
// const mongoose = require('mongoose')
// const express = require('express')
// const app = express()
// const path = require('path')
import config from './utils/config.js'
import corsMiddleware from './utils/corsConfig.js'
import middleware from './utils/middleware.js'
import logger from './utils/logger.js'
import mongoose from 'mongoose'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
//get root dir name
const __dirname = path.dirname(__filename)
// console.log(__filename)
// console.log(__dirname)

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
app.use(express.static('dist'))
//serves static uploads for journal coverimg
// app.use('/uploads', (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     next()
//   }, express.static(path.join(__dirname, '/uploads')))
//attaches token string to request.token
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

//Eliminates need for try/catch in router async calls
// require('express-async-errors')
import 'express-async-errors'
// const tasksRouter = require('./controllers/tasks')
import tasksRouter from './controllers/tasks.js'
app.use('/api/tasks', tasksRouter)
// const usersRouter = require('./controllers/users')
import usersRouter from './controllers/users.js'
app.use('/api/users', usersRouter)
// const loginRouter = require('./controllers/login')
import loginRouter from './controllers/login.js'
app.use('/api/login', loginRouter)
// const journalRouter = require('./controllers/journal')
import journalRouter from './controllers/journal.js'
app.use('/api/journal', journalRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// module.exports = app
export default app
