const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../access.log')
)

const morganLogger = morgan('short', {
    stream: accessLogStream,
})

module.exports = {
    morganLogger,
}
