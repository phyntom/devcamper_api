const express = require('express')
const dotenv = require('dotenv')

// load env vars

dotenv.config({ path: './config/.env' })

const app = express()

app.get('/api/v1/bootcamps', function (req, res) {
    res.status(200).json({ success: true, msg: 'Show all bootcamps' })
})

app.get('/api/v1/bootcamps/:id', function (req, res) {
    res.status(200).json({
        success: true,
        msg: `Get a bootcamp ${req.params.id}`,
    })
})

app.post('/api/v1/bootcamps', function (req, res) {
    res.status(201).json({ success: true, msg: 'Create new bootcamp' })
})

app.put('/api/v1/bootcamps/:id', function (req, res) {
    res.status(200).json({
        success: true,
        msg: `Update a bootcamp ${req.params.id}`,
    })
})

app.delete('/api/v1/bootcamps/:id', function (req, res) {
    res.status(200).json({
        success: true,
        msg: `Delete a bootcamp ${req.params.id}`,
    })
})

const PORT = process.env.PORT || 3500

const ENV = process.env.NODE_ENV

app.listen(PORT, (error) => {
    if (error) {
        console.error('An error occurs', error)
    }
    console.log(`server running in ${ENV} mode on ${PORT} ....`)
})
