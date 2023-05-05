const express = require('express')
const bootCampController = require('../controllers/bootcampController')

// includes other resources routers
const courseRouter = require('./course')

const router = express.Router()

// Re-route into the resources router
router.use('/:bootcampId/courses', courseRouter)

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp,
    getBootCampsInRadius,
    bootcampFileUpload,
} = bootCampController

// using chainable route handlers
router.route('/').get(getBootcamps).post(createBootcamp)

// using normal express router without chainable route
router.get('/:id', getBootcamp)

router.get('/radius/:zipcode/:distance', getBootCampsInRadius)

router.put('/:id', updateBootcamp)

router.delete('/:id', deleteBootcamp)

router.put('/:id/photo', bootcampFileUpload)

module.exports = router
