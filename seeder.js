const dotenv = require('dotenv')
const mongoose = require('mongoose')
const fs = require('fs')
const color = require('colors')

dotenv.config({ path: './config/.env' })

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    maxPoolSize: 2,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})

// method to import data from file to mongo db collection

const importData = async () => {
    try {
        const bootCamps = await JSON.parse(
            fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8')
        )
        const courses = await JSON.parse(fs.readFileSync(`${__dirname}/data/course.json`, 'utf-8'))
        const users = await JSON.parse(fs.readFileSync(`${__dirname}/data/user.json`, 'utf-8'))
        await Bootcamp.create(bootCamps)
        await Course.create(courses)
        await User.create(users)
        console.log(`Date imported successfully ...`.green.inverse)
        process.exit()
    } catch (err) {
        console.error(`${err}`.red)
        process.exit()
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log(`Data deleted successfully ...`.green)
        process.exit()
    } catch (err) {
        console.error(`${err}`.red)
        process.exit()
    }
}

if (process.argv[2] === '-i' || process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '-d' || process.argv[2] === '--delete') {
    deleteData()
} else {
    console.log('unknown or missing options | provide --import | --delete | -d | -i options')
    process.exit(0)
}
