const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { tokenService } = require('../services/index.service')

const authChecker = async (req, res, next) => {
    try {
        const token =
            req.headers && req.headers.authorization
                ? req.headers.authorization.split(' ')[1]
                : ''
        const decoded = await tokenService.verifyToken(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )
        req.user = decoded
        next()
    } catch (error) {
        Logger.error(error)
        next(error)
    }
}

const authorizeRole = (role) => async (req, res, next) => {
    try {
        if (role !== req.user.role) {
            return next(
                new ApiError(
                    constant.MESSAGES.NOT_ALLOWED,
                    httpStatus.FORBIDDEN
                )
            )
        }
        next()
    } catch (error) {
        Logger.error(error)
        next(error)
    }
}

module.exports = {
    authChecker,
    authorizeRole,
}
