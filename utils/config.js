// require('dotenv').config()
import dotenv from 'dotenv'
dotenv.config()

const config = {
  development: {
    dbUrl: process.env.DEV_MONGODB_URL
  },
  test: {
    dbUrl: process.env.TEST_MONGODB_URL
  },
  production: {
    dbUrl: process.env.MONGODB_URL
  }
}

const PORT = process.env.PORT
const env = process.env.NODE_ENV || 'development'
// console.log('env', env)
const MONGODB_URL = config[env].dbUrl
const SECRET = process.env.SECRET

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_REGION = process.env.AWS_REGION

// module.exports = {
//   PORT,
//   MONGODB_URL,
//   SECRET
// }
export default {
  PORT,
  MONGODB_URL,
  SECRET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION
}
