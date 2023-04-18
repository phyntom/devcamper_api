const express = require('express')
const courseController = require('../controllers/courseController')

const router = express.Router({ mergeParams: true })

const { getCourses, getCourse } = courseController

router.get('/', getCourses)

module.exports = router
