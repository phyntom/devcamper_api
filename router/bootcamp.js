const express = require('express')
const bootCampController = require('../controllers/bootcampController')

const router = express.Router()

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp,
    getBootCampsInRadius,
} = bootCampController

// using chainable route handlers
router.route('/').get(getBootcamps).post(createBootcamp)

// using normal express router without chainable route
router.get('/:id', getBootcamp)

router.get('/radius/:zipcode/:distance', getBootCampsInRadius)

router.put('/:id', updateBootcamp)

router.delete('/:id', deleteBootcamp)

module.exports = router
