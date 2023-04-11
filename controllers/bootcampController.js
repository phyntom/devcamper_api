const Bootcamp = require('../models/Bootcamp')
const ErrorReponse = require('../utils/ErrorResponse')
const asyncHanlder = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
const getBootcamps = asyncHanlder(async (req, res, next) => {
    // copy req.query
    const reqQuery = { ...req.query }

    // fields to exclude
    const excludedFields = ['select', 'sort', 'page', 'limit']

    // loop over excludedFields and delete them frp, reqQuery
    excludedFields.forEach((param) => delete reqQuery[param])
    // create query string
    let queryString = JSON.stringify(reqQuery)

    // replace with $ for query filter for operators
    queryString = queryString.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    )

    let query = Bootcamp.find(JSON.parse(queryString))

    if (req?.query?.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    if (req?.query?.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort({ createdAt: -1 })
    }

    // pagination

    const page = parseInt(req?.query?.page, 10) || 1
    const limit = parseInt(req?.query?.limit, 10) || 1
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query.skip(startIndex).limit(limit)

    // execute query
    const bootcamps = await query

    const pagination = {}

    // in case we still have records after current endIndex
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }
    // in case we moved to the next startIndex
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination: bootcamps.length > 0 ? pagination : {},
        data: bootcamps,
    })
})

// @desc get all bootcamps
// @route GET /api/v1/bootcamps/:id
// access Public
const getBootcamp = asyncHanlder(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        next(new ErrorReponse(`Cannot find bootcamp with id ${req.params.id}`, 404))
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

// @desc update a given bootcamp
// @route PUT /api/v1/bootcamps/
// access Private
const updateBootcamp = asyncHanlder(async (req, res, next) => {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            runValidators: true,
        }
    )
    if (!updatedBootcamp) {
        next(new ErrorReponse(`Cannot find bootcamp with id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: updatedBootcamp,
    })
})

// @desc delete a given bootcamp
// @route POST /api/v1/bootcamps/
// access Private
const deleteBootcamp = async (req, res, next) => {
    try {
        const updatedBootcamp = await Bootcamp.findByIdAndDelete(
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
        next(err)
    }
}

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootCampsInRadius,
}
