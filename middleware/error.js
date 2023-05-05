const ErrorReponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    if (err.name === 'CastError' || (error.statusCode >= 400 && error.statusCode <= 404)) {
        error = new ErrorReponse(err.message, error.statusCode)
    }
    if (err.name == 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message)
        error = new ErrorReponse(message, 404)
    }
    if (err.name == '11000') {
        const message = 'Duplicate filed value entered'
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
