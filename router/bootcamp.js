const express = require('express')
const bootCampController = require('../controllers/bootcampController')
const { protect, authorize } = require('../middleware/authenticate')

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
router.route('/').get(getBootcamps).post(protect, authorize('admin', 'publisher'), createBootcamp)

// using normal express router without chainable route
router.get('/:id', getBootcamp)

router.get('/radius/:zipcode/:distance', getBootCampsInRadius)

router.put('/:id', protect, authorize('admin', 'publisher'), updateBootcamp)

router.delete('/:id', protect, authorize('admin', 'publisher'), deleteBootcamp)

router.put('/:id/photo', protect, authorize('admin', 'publisher'), bootcampFileUpload)

module.exports = router
