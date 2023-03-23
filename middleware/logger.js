const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const httpStream = fs.createWriteStream(
    path.join(__dirname, '../access.log')
)

const httpLogger = morgan('short', {
    stream: httpStream,
})

module.exports = {
    httpLogger,
}
