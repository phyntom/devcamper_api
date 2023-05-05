const mongoose = require('mongoose')
const Bootcamp = require('./Bootcamp')

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
        type: [String],
        enum: {
            values: ['beginner', 'intermidiate', 'advanced'],
            message: 'value is not supported',
            required: true,
        },
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

CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const average = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' },
            },
        },
    ])
    try {
        let bootcamp = await Bootcamp.findByIdAndUpdate(bootcampId, {
            averageCost: Math.round(average[0].averageCost),
        })
    } catch (error) {
        next(error)
    }
}

CourseSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.bootcamp)
})

CourseSchema.pre('deleteOne', async function (next) {
    await this.constructor.getAverageCost(this.bootcamp)
    next()
})

module.exports = mongoose.model('Course', CourseSchema)
