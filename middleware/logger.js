const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const httpStream = fs.createWriteStream(
    path.join(__dirname, '../logs/access.log')
)

const httpLogger = morgan('short', {
    stream: httpStream,
})

module.exports = {
    httpLogger,
}
