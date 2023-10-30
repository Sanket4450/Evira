const express = require('express')
const httpStatus = require('http-status')
const cors = require('cors')
const config = require('./src/config/config')
const connectDB = require('./src/config/db')
const Logger = require('./src/middlewares/logger')
const domain = require('./src/models/index.model')
const { userRoutes, adminRoutes } = require('./src/routes/index.route')
const ApiError = require('./src/utils/ApiError')
const { errorConverter, errorHandler } = require('./src/middlewares/error')

const app = express()
connectDB()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    )
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'Content-Type')
    next()
})

global.config = config
global.Logger = Logger
global.domain = domain

app.use(cors({ allowedHeaders: ['Origin', 'Authorization', 'Content-Type', 'Accept'] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1', userRoutes)
app.use('/api/v1/admin', adminRoutes)

app.use((req, res, next) => {
    next(new ApiError('Route not Found', httpStatus.NOT_FOUND))
})

app.use(errorConverter)

app.use(errorHandler)

module.exports = app
