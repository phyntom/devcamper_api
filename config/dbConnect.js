const mongoose = require('mongoose')

const dbConnect = async () => {
    const con = await mongoose.connect(
        process.env.MONGO_URI,
        {
            useUnifiedTopology: true,
            maxPoolSize: 50,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        }
    )
    console.log(
        `Connected successfully on ${con.connection.host}`
            .cyan.underline.bold
    )
}

module.exports = dbConnect
