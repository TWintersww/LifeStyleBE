const cors = require('cors')
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://lifestyle-app.fly.dev'
]
// const corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200
// }
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies or authorization headers
  optionsSuccessStatus: 200 // To support older browsers
}

const corsMiddleware = cors(corsOptions)
module.exports = corsMiddleware
