const Post = require('../models/post')
const journalRouter = require('express').Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const fs = require('fs')
const logger = require('../utils/logger')
const userExtractor = require('../utils/middleware').userExtractor

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
  
    //give image in /uploads a picture format
    const ext = getImgExtension(request.file.originalname)
    const path = request.file.path
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
  
    const {title, summary, content} = request.body
    if (!title) {
      throw new Error('Title is required')
    }

    const postDocument = new Post({
      title,
      summary,
      content,
      coverimg: newPath,
      user: loggedInUserDocument.id
    })
    const savedDocument = await postDocument.save()

    loggedInUserDocument.posts = loggedInUserDocument.posts.concat(savedDocument._id)
    await loggedInUserDocument.save()
    
    response.status(201).json(savedDocument)
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

    if (!request.file) {
      throw new Error('Cover image is required')
    }
  
    const ext = getImgExtension(request.file.originalname)
    const path = request.file.path
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
  
    const {title, summary, content} = request.body
    if (!title) {
      throw new Error('Title is required')
    }

    postDocument.title = title || postDocument.title
    postDocument.summary = summary || postDocument.summary
    postDocument.content = content || postDocument.content
    postDocument.files = newPath
  
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


module.exports = journalRouter
