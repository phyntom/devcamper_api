const express = require('express')
const courseController = require('../controllers/courseController')

const router = express.Router({ mergeParams: true })

const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } =
    courseController

router.get('/', getCourses)
router.get('/:id', getCourse)
router.post('/', createCourse)
router.put('/:id', updateCourse)
router.delete('/:id', deleteCourse)

module.exports = router
