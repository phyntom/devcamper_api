const User = require('../models/User')
const mongoose = require('mongoose')
const ErrorReponse = require('../utils/ErrorResponse')
const asyncHanlder = require('../middleware/async')

// @desc    Register user
// @route   POST /api/v1/auth/register
// access   Public

const register = asyncHanlder(async (req, res, next) => {
    const { name, email, password, role } = req.body
    const createdUser = await User.create({
        name,
        email,
        password,
        role,
    })

    const token = createdUser.getSignedJwtToken()

    sendAuthToken(res, 200, createdUser)
})

// @desc    Login user
// @route   POST /api/v1/auth/register
// access   Public

const login = asyncHanlder(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorReponse('Please provide email and passoword', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorReponse('Invalid credentials provided', 401))
    }

    const isMatchPassword = await user.matchPassword(password)

    if (!isMatchPassword) {
        return next(new ErrorReponse('Invalid credentials provided', 401))
    }

    const token = user.getSignedJwtToken()

    sendAuthToken(res, 200, user)
})

function sendAuthToken(res, statusCode, user) {
    const token = user.getSignedJwtToken()
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token: token,
    })
}

// @desc    Login user
// @route   POST /api/v1/auth/register
// access   Public

const getMe = asyncHanlder(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user,
    })
})

module.exports = {
    register,
    login,
    getMe,
}
