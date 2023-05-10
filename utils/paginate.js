const ErrorReponse = require('./ErrorResponse')

async function paginate(model, populate, req, page = 1, limit = 10, next) {
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    try {
        // create pagination object
        const pagination = {}
        const reqQuery = { ...req.query }
        // fields to exclude
        const excludedFields = ['select', 'sort', 'page', 'limit']

        // loop over excludedFields and delete them frp, reqQuery
        excludedFields.forEach((param) => delete reqQuery[param])
        // create query string
        let queryString = JSON.stringify(reqQuery)

        // replace with $ for query filter for operators
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

        let query = model.find(JSON.parse(queryString))

        if (populate) {
            query = query.populate(populate)
        }

        if (req?.query?.select) {
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        if (req?.query?.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort({ createdAt: -1 })
        }

        const results = await model.find(query).skip(startIndex).limit(limit)

        const count = await model.countDocuments(query)

        const totalPages = Math.ceil(count / limit)

        if (count > 0) {
            pagination.totalPages = totalPages
            pagination.limit = limit
            // in case we still have records after current endIndex
            if (endIndex < count) {
                pagination.next = {
                    page: parseInt(page) + 1,
                }
            }
            // in case we moved to the next startIndex
            if (startIndex > 0) {
                pagination.prev = {
                    page: parseInt(page) - 1,
                }
            }
        }
        return {
            count: count,
            pagination: pagination,
            results,
        }
    } catch (error) {
        return next(new ErrorReponse(`Could not fecthing all record`))
    }
}

module.exports = paginate
