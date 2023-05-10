const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add a name ! '],
    },
    email: {
        type: String,
        required: [true, 'Please add a valid email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: 6,
        select: false,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// encrypt the password using bcrypt
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
