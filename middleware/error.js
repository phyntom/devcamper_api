const ErrorReponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    console.error(`${err}`.red)
    if (err.name === 'CastError' || (error.statusCode >= 400 && error.statusCode <= 451)) {
        error = new ErrorReponse(err.message, error.statusCode)
    }
    if (err.name == 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message)
        error = new ErrorReponse(message, 404)
    }
    if (err.code == '11000') {
        const message = `Duplicate field value entered ${Object.keys(err.keyValue)}`
        error = new ErrorReponse(message, 400)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server error',
    })
}
module.exports = {
    errorHandler,
}
