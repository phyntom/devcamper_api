const mongoose = require('mongoose')

const dbConnect = async () => {
    const con = await mongoose.connect(
        process.env.MONGO_URI,
        {
            useUnifiedTopology: true,
        }
    )
    console.log(
        `Connected successfully on ${con.connection.host}`
            .cyan.underline.bold
    )
}

module.exports = dbConnect
