import mongoose from 'mongoose'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'

export const errorConverter = (err, req, res, next) => {
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

export const errorHandler = (err, req, res, next) => {
    const {message, statusCode} = err

    const response = {
        type: "error",
        message
    }

    if (config.environment === 'development') {
        Logger.error(err)
    }

    res.status(statusCode).json(response)
}