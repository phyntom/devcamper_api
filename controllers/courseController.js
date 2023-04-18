const Course = require('../models/Course')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHanlder = require('../middleware/async')

// @desc      get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const getCourses = asyncHanlder(async (req, res, next) => {
    let courses = []
    if (req.params.bootcampId) {
        courses = await Course.find({ bootcamp: req.params.bootcampId })
    } else {
        courses = await Course.find()
    }
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    })
})
//@desc     get single course by id
//@route    GET /api/v1/courses/:id
//@access   Public
const getCourse = asyncHanlder(async (req, res, next) => {
    let courses = await Course.find(req.params.id)
    res.status(200).json({
        success: true,
        count: courses.length,
        pagination,
        data: courses,
    })
})

module.exports = {
    getCourses,
    getCourse,
}
