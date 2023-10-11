const express = require('express')
const httpStatus = require('http-status')
const config = require('./src/config/config')
const connectDB = require('./src/config/db')
const Logger = require('./src/middlewares/logger')
const domain = require('./src/models/index.model')
const routes = require('./src/routes/index.route')
const ApiError = require('./src/utils/ApiError')
const { errorConverter, errorHandler } = require('./src/middlewares/error')

const app = express()
connectDB()

global.config = config
global.Logger = Logger
global.domain = domain

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/v1', routes)

app.use((req, res, next) => {
    next(new ApiError('Route not Found', httpStatus.NOT_FOUND))
})

app.use(errorConverter)

app.use(errorHandler)

module.exports = app