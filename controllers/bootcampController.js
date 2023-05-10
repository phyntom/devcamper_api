const Bootcamp = require('../models/Bootcamp')
const mongoose = require('mongoose')
const ErrorReponse = require('../utils/ErrorResponse')
const asyncHanlder = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const _ = require('lodash')
const ObjectId = mongoose.Types.ObjectId
const path = require('path')
const paginate = require('../utils/paginate')

// @desc    get all bootcamps
// @route   GET /api/v1/bootcamps
const getBootcamps = asyncHanlder(async (req, res, next) => {
    // copy req.query
    const { page, limit } = req.query
    const { count, pagination, results } = await paginate(
        Bootcamp,
        { path: 'courses', select: 'title description' },
        req.query,
        page,
        limit,
        next
    )
    res.status(200).json({
        success: true,
        count: count,
        pagination,
        data: results,
    })
})

// @desc    get all bootcamps
// @route   GET /api/v1/bootcamps/:id
// access   Public
const getBootcamp = asyncHanlder(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorReponse(`Cannot find bootcamp with id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    })
})

// @desc get all bootcamps
// @route POST /api/v1/bootcamps/
// access Private
const createBootcamp = asyncHanlder(async (req, res, next) => {
    const bootCamp = req.body
    const createBootCamp = await Bootcamp.create(bootCamp)
    res.status(201).json({
        success: true,
        data: createBootCamp,
        msg: 'New bootcamp created successfully !!!',
    })
})

// @desc    update a given bootcamp
// @route   PUT /api/v1/bootcamps/
// access   Private
const updateBootcamp = asyncHanlder(async (req, res, next) => {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
    })
    if (!updatedBootcamp) {
        return next(new ErrorReponse(`Cannot find bootcamp with id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: updatedBootcamp,
    })
})

// @desc delete a given bootcamp
// @route POST /api/v1/bootcamps/
// access Private
const deleteBootcamp = asyncHanlder(async (req, res, next) => {
    const { id } = req.params
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (_.isEmpty(bootcamp)) {
        return next(new ErrorReponse(`Cannot find bootcamp with id ${id}`, 404))
    }
    await bootcamp.deleteOne()
    res.status(200).json({
        success: true,
        data: {},
    })
})
// @desc get bootcaps with a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// access Private
const getBootCampsInRadius = async (req, res, next) => {
    try {
        const { zipcode, distance } = req.params
        // get lat and long from geocoder
        const loc = await geocoder.geocode(zipcode)
        const lat = loc[0].latitude
        const long = loc[0].longitude

        // calc radius by dividing distance with earth radius
        // earth radius 3963 mi || 6378 km

        const radius = distance / 3963
        const bootCamps = await Bootcamp.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[long, lat], radius],
                },
            },
        })
        res.json({
            success: true,
            count: bootCamps.length,
            data: bootCamps,
        })
    } catch (error) {
        next(error)
    }
}

// @desc Upload photo for a given bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// access Private
const bootcampFileUpload = asyncHanlder(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id)
    if (_.isEmpty(bootcamp)) {
        return next(new ErrorReponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorReponse(`Please upload a file 😛`, 400))
    }
    // get the actual file
    let photo = req.files.file
    // check if the upload file is an image
    if (!photo.mimetype.startsWith('image')) {
        return next(new ErrorReponse(`Please upload an image 😛`, 404))
    }

    // create custom bootcamp image name
    let createdFileName = `image_${bootcamp._id}${path.parse(photo.name).ext}`

    photo.mv(process.env.UPLOAD_PATH + createdFileName, async function (err) {
        if (err) {
            return next(new ErrorReponse(`Problem with bootcamp photo upload`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: createdFileName })
        res.json({
            success: true,
            msg: 'Bootcamp photo uploaded successfully 💥',
            data: createdFileName,
        })
    })
})

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootCampsInRadius,
    bootcampFileUpload,
}
