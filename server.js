const express = require('express')
const dotenv = require('dotenv')
const bootcamperRouter = require('./router/bootcamper')
const logger = require('./middleware/logger')

// extract morgan middleware
const { morganLogger } = logger

// load env vars
dotenv.config({ path: './config/.env' })

// create express app
const app = express()

app.use(morganLogger)

// register bootcamp router
app.use('/api/v1/bootcamps', bootcamperRouter)

const PORT = process.env.PORT || 3500

const ENV = process.env.NODE_ENV

app.listen(PORT, (error) => {
    if (error) {
        console.error('An error occurs', error)
    }
    console.log(
        `server running in ${ENV} mode on ${PORT} ....`
    )
})
