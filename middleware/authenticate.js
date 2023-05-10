const jwt = require('jsonwebtoken')
const asyncHanlder = require('./async')
const User = require('../models/User')
const ErrorReponse = require('../utils/ErrorResponse')
const _ = require('lodash')

const protect = asyncHanlder(async (req, res, next) => {
    let token
    // get token from authorization header
    if (req.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    // get token from cookies header
    //else if (req.cookies?.token) {
    //    token = req.cookies.token
    //}
    // refurse access if token is not provided
    if (!token) {
        return next(new ErrorReponse('Not authorized to access this resource', 401))
    }
    // vefirfy token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorReponse('Not authorized to access this resource', 401))
    }
})

function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            return next(
                new ErrorReponse(
                    `User role ${req.user.role} is not athorized to access this route`,
                    403
                )
            )
        }
    }
}

module.exports = {
    protect,
    authorize,
}
