const ErrorReponse = require('../utils/ErrorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    if (err.name === 'CastError') {
        const message = `Cannot find bootcamp with id ${err.value}`
        error = new ErrorReponse(message, 404)
    }
    if (err.name == 'ValidationError') {
        const message = Object.values(err.errors).map(
            (val) => val.message
        )
        error = new ErrorReponse(message, 404)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server error',
    })
}
module.exports = {
    errorHandler,
}
