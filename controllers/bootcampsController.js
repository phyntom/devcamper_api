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
const createBootcamp = (req, res, next) => {
    res.status(201).json({
        success: true,
        msg: 'Create new bootcamp',
    })
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
