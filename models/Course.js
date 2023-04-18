const mongoose = require('mongoose')

const { Schema } = mongoose

const CourseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'please add course title'],
    },
    description: {
        type: String,
        required: [true, 'please add course description'],
    },
    weeks: {
        type: Number,
        required: [true, 'please add course duration in weeks'],
    },
    tuition: {
        type: Number,
        required: [true, 'please add a tuition course'],
    },
    minimumRequiredSkills: {
        type: String,
        enum: ['beginner', 'intermidiate', 'advanced'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
})

module.exports = mongoose.model('Course', CourseSchema)
