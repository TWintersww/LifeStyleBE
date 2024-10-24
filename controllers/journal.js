// const Post = require('../models/post')
// const journalRouter = require('express').Router()
// const multer = require('multer')
// const upload = multer({dest: 'uploads/'})
// const fs = require('fs')
// const logger = require('../utils/logger')
// const userExtractor = require('../utils/middleware').userExtractor
import Post from '../models/post.js'
import express from 'express'
const journalRouter = express.Router()
import multer from 'multer'
import fs from 'fs'
import s3Client from '../utils/s3Client.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import logger from '../utils/logger.js'
import middleware from '../utils/middleware.js'
const { userExtractor } = middleware

// const upload = multer({dest: 'uploads/'})
const storage = multer.memoryStorage();
const upload = multer({storage: storage})

const getImgExtension = (originalname) => {
  const originalnameParts = originalname.split('.')
  const ext = originalnameParts[originalnameParts.length - 1]
  return ext
}

//coverimg field of sent object saved to request.file
journalRouter.post('/', upload.single('coverimg'), userExtractor, async (request, response) => {
  try {
    // logger.info('journalRouter POST')
    const loggedInUserDocument = request.user
    // logger.info('journal.js | loggedInUserDocument:', loggedInUserDocument)
    // logger.info('request content:', request.body.content)

    if (!request.file) {
      throw new Error('Cover image is required')
    }
  
    //upload image to S3 bucket
    const coverImgKey = `${uuidv4()}_${request.file.originalname}`
    const s3Params = {
      Bucket: "evwu-lifestyle-app",
      Key: coverImgKey,
      Body: request.file.buffer
    }
    await s3Client.send(new PutObjectCommand(s3Params))
    //create public accessible URL for clientside rendering
    const s3URI = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`
    // console.log('s3URI', s3URI)

    const {title, summary, content} = request.body
    if (!title) {
      throw new Error('Title is required')
    }

    const postDocument = new Post({
      title,
      summary,
      content,
      coverimg: s3URI,
      user: loggedInUserDocument.id
    })
    const savedDocument = await postDocument.save()

    loggedInUserDocument.posts = loggedInUserDocument.posts.concat(savedDocument._id)
    await loggedInUserDocument.save()
    
    response.status(201).json(savedDocument)
    //response.status(201).end()
  }
  catch (e) {
    // logger.error('Error creating post:', e.message)
    response.status(400).json({error: e.message})
  }
})

journalRouter.put('/:id', upload.single('coverimg'), async (request, response) => {
  try {
    const { id } = request.params
    const postDocument = await Post.findById(id)

    let s3URI;
    /*
    If upload new image: new S3 query
    Else: save old s3URI
    */
    if (request.file) {
      const coverImgKey = `${uuidv4()}_${request.file.originalname}`
      const s3Params = {
        Bucket: "evwu-lifestyle-app",
        Key: coverImgKey,
        Body: request.file.buffer
      }
      await s3Client.send(new PutObjectCommand(s3Params));
      s3URI = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`
    }
    else {
      s3URI = request.body.existingCoverimg
    }

  
    const {title, summary, content} = request.body
    if (!title) {
      throw new Error('Title is required')
    }

    postDocument.title = title || postDocument.title
    postDocument.summary = summary || postDocument.summary
    postDocument.content = content || postDocument.content
    postDocument.coverimg = s3URI
  
    const updatedPost = await postDocument.save()
    response.status(200).json(updatedPost)
  }
  catch (e) {
    // logger.error('Error creating post:', e.message)
    response.status(400).json({error: e.message})
  }
})

journalRouter.get('/', userExtractor, async (request, response) => {
  const loggedInUserDocument = request.user

  const allPosts = await Post.find({user: loggedInUserDocument._id}).populate('user', {username: 1, name: 1})
  response.status(200).json(allPosts)
})

journalRouter.get('/:id', userExtractor, async (request, response) => {
  const loggedInUserDocument = request.user

  try {
    const id = request.params.id
    const onePost = await Post.findOne({_id: id, user: loggedInUserDocument._id})
    // logger.info('journalRouter GET/:id', onePost)

    if (!onePost) {
      throw new Error('Post with id and user could not be found')
    }

    response.status(200).json(onePost)
  }
  catch (e) {
    // logger.error(e)
    response.status(400).json({error: e.message})
  }
})

//For admin use
journalRouter.post('/clearAll', async (request, response) => {
  await Post.deleteMany()

  response.status(200).end()
})


// module.exports = journalRouter
export default journalRouter
