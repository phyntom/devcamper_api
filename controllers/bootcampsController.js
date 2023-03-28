const Bootcamp = require('../models/Bootcamp')

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
const getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all bootcamps',
    })
}

// @desc get all bootcamps
// @route GET /api/v1/bootcamps/:id
// access Public
const getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Get a bootcamp ${req.params.id}`,
    })
}

// @desc get all bootcamps
// @route POST /api/v1/bootcamps/
// access Private
const createBootcamp = async (req, res, next) => {
    try {
        const bootCamp = req.body
        const createBootCamp = await Bootcamp.create(
            bootCamp
        )
        res.status(201).json({
            success: true,
            data: createBootCamp,
            msg: 'Create new bootcamp',
        })
    } catch (error) {
        res.status(404).json({
            success: false,
        })
    }
}

// @desc update a given bootcamp
// @route PUT /api/v1/bootcamps/
// access Private
const updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update a bootcamp ${req.params.id}`,
    })
}

// @desc delete a given bootcamp
// @route POST /api/v1/bootcamps/
// access Private
const deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete a bootcamp ${req.params.id}`,
    })
}

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
}
