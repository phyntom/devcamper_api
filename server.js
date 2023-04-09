const express = require('express')
const dotenv = require('dotenv')
const bootcamperRouter = require('./router/bootcamp')
const dbConnect = require('./config/dbConnect')
const colors = require('colors')
// extract morgan middleware
const { httpLogger } = require('./middleware/logger')

const { errorHandler } = require('./middleware/error')

// load env vars
dotenv.config({ path: './config/.env' })

// connect to db before anything else
dbConnect()

// create express app
const app = express()

// body parser
app.use(express.json())

app.use(httpLogger)

// register bootcamp router
app.use('/api/v1/bootcamps', bootcamperRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3500

const ENV = process.env.NODE_ENV

// create object server after the app has started
const server = app.listen(PORT, (error) => {
    if (error) {
        console.error('An error occurs', error)
    }
    console.log(
        `Server running in ${ENV} mode on ${PORT} ....`
            .yellow.bold
    )
})
// handle unhandledRejection promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`.red)
    // close the server and exit the process
    server.close(() => {
        process.exit(1)
    })
})
