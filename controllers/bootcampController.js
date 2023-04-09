const Bootcamp = require('../models/Bootcamp')
const ErrorReponse = require('../utils/ErrorResponse')
const asyncHanlder = require('../middleware/async')

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
const getBootcamps = asyncHanlder(
    async (req, res, next) => {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            data: bootcamps,
        })
    }
)

// @desc get all bootcamps
// @route GET /api/v1/bootcamps/:id
// access Public
const getBootcamp = asyncHanlder(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        next(
            new ErrorReponse(
                `Cannot find bootcamp with id ${req.params.id}`,
                404
            )
        )
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    })
})

// @desc get all bootcamps
// @route POST /api/v1/bootcamps/
// access Private
const createBootcamp = asyncHanlder(
    async (req, res, next) => {
        const bootCamp = req.body
        const createBootCamp = await Bootcamp.create(
            bootCamp
        )
        res.status(201).json({
            success: true,
            data: createBootCamp,
            msg: 'New bootcamp created successfully !!!',
        })
    }
)

// @desc update a given bootcamp
// @route PUT /api/v1/bootcamps/
// access Private
const updateBootcamp = asyncHanlder(
    async (req, res, next) => {
        const updatedBootcamp =
            await Bootcamp.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    runValidators: true,
                }
            )
        if (!updatedBootcamp) {
            next(
                new ErrorReponse(
                    `Cannot find bootcamp with id ${req.params.id}`,
                    404
                )
            )
        }
        res.status(200).json({
            success: true,
            data: updatedBootcamp,
        })
    }
)

// @desc delete a given bootcamp
// @route POST /api/v1/bootcamps/
// access Private
const deleteBootcamp = async (req, res, next) => {
    try {
        const updatedBootcamp =
            await Bootcamp.findByIdAndDelete(
                req.params.id,
                req.body,
                {
                    runValidators: true,
                }
            )
        if (!updatedBootcamp) {
            next(
                new ErrorReponse(
                    `Cannot find bootcamp with id ${req.params.id}`,
                    404
                )
            )
        }
        res.status(200).json({
            success: true,
            data: {},
        })
    } catch (error) {
        next(err)
    }
}

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
}
