const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const bootcampRouter = require('./router/bootcamp')
const courseRouter = require('./router/course')
const registerRouter = require('./router/authentication')
const dbConnect = require('./config/dbConnect')
const colors = require('colors')
// extract morgan middleware
const { httpLogger } = require('./middleware/logger')
const { errorHandler } = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')

// load env vars
dotenv.config({ path: './config/.env' })

// connect to db before anything else
dbConnect()

// create express app
const app = express()
// use fileupload middleware from express-fileupload
app.use(
    fileupload({
        createParentPath: true,
        useTempFiles: true,
        tempFileDir: '/tmp/',
        limits: { fileSize: process.env.MAX_UPLOAD_LIMITS },
        debug: true,
    })
)
// body parser
app.use(express.json())

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'images')))

app.use(httpLogger)

// register bootcamp router
app.use('/api/v1/bootcamps', bootcampRouter)
app.use('/api/v1/courses', courseRouter)
app.use('/api/v1/auth', registerRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3500

const ENV = process.env.NODE_ENV

// create object server after the app has started
const server = app.listen(PORT, (error) => {
    if (error) {
        console.error('An error occurs', error)
    }
    console.log(`Server running in ${ENV} mode on ${PORT} ....`.yellow.bold)
})
// handle unhandledRejection promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`.red)
    // close the server and exit the process
    server.close(() => {
        process.exit(1)
    })
})
