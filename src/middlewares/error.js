const mongoose = require('mongoose')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')

exports.errorConverter = (err, req, res, next) => {
    if (!(err instanceof ApiError)) {
        const statusCode =
            err.statusCode || err instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR
        const message = err.message || httpStatus[statusCode]
        err = new ApiError(message, statusCode, err.stack)
    }
    next(err)
}

exports.errorHandler = (err, req, res, next) => {
    const { message, statusCode } = err
    
    const response = {
        type: "error",
        message,
        ...(config.environment === 'development' && { stack: err.stack })

    }
    if (config.environment === 'development') {
        Logger.error(err)
    }

    res.status(statusCode).json(response)
}