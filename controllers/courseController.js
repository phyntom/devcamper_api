const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHanlder = require('../middleware/async')
const _ = require('lodash')

// @desc      get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const getCourses = asyncHanlder(async (req, res, next) => {
    let courses = []
    if (req.params.bootcampId) {
        courses = await Course.find({ bootcamp: req.params.bootcampId })
    } else {
        courses = await Course.find().populate({
            path: 'bootcamp',
            select: 'name description',
        })
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
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: '-_id name description',
    })
    if (_.isEmpty(course)) {
        return next(new ErrorResponse(`Cannot find course with id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: course,
    })
})
//@desc     create course
//@route    POST /api/v1/courses/
//@access   Public
const createCourse = asyncHanlder(async (req, res, next) => {
    const newCourse = req.body
    const bootcamp = await Bootcamp.findById(req.body.bootcamp)
    if (_.isEmpty(bootcamp)) {
        return next(new ErrorResponse(`Cannot find bootcamp with id - ${req.body.bootcamp}`, 404))
    }
    const createdCourse = await Course.create(newCourse)
    res.status(200).json({
        success: true,
        data: createdCourse,
        msg: 'New course created successfully !!!',
    })
})
//@desc     get single course by id
//@route    DELETE /api/v1/courses/:id
//@access   Public
const deleteCourse = asyncHanlder(async (req, res, next) => {
    const { id } = req.params
    const course = await Course.findById(id)
    if (_.isEmpty(course)) {
        return next(new ErrorResponse(`Cannot find a course with id -${id}`, 404))
    }
    await course.deleteOne()
    res.status(200).json({
        success: true,
        data: {},
        msg: 'Course deleted successfuly !!!',
    })
})
//@desc     update single course by id
//@route    PUT /api/v1/courses/:id
//@access   Public
const updateCourse = asyncHanlder(async (req, res, next) => {
    let updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    })
    if (_.isEmpty(updatedCourse)) {
        return next(new ErrorResponse(`Cannot find a course to update with id - ${id}`))
    }
    res.status(201).json({
        success: true,
        data: updatedCourse,
        msg: 'Course updated successfully !!!',
    })
})

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
}
