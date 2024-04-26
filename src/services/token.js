const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const configConstant = require('../config/constants')
const userService = require('./user')

const generateToken = ({ payload, secret, options }) => {
    return jwt.sign(payload, secret, options)
}

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    reject(
                        new ApiError(
                            constant.MESSAGES.INVALID_TOKEN,
                            httpStatus.UNAUTHORIZED
                        )
                    )
                }
                if (err.name === 'TokenExpiredError') {
                    reject(
                        new ApiError(
                            constant.MESSAGES.TOKEN_EXPIRED,
                            httpStatus.NOT_ACCEPTABLE
                        )
                    )
                }
                reject(new ApiError(err.message, httpStatus.UNAUTHORIZED))
            } else {
                resolve(decoded)
            }
        })
    })
}

const decodeToken = (token, secret) => {
    if (!token) {
        throw new ApiError(
            constant.MESSAGES.TOKEN_IS_REQUIRED,
            httpStatus.FORBIDDEN
        )
    }
    return jwt.decode(token)
}

const generateAuthTokens = async (userId, role = 'user') => {
    Logger.info(`Inside generateAuthTokens => role = ${role}`)

    const payload = {
        sub: userId,
        role,
    }
    const accessToken = generateToken({
        payload,
        secret: process.env.ACCESS_TOKEN_SECRET,
        options: { expiresIn: configConstant.ACCESS_TOKEN_EXPIRY },
    })
    const refreshToken = generateToken({
        payload,
        secret: process.env.REFRESH_TOKEN_SECRET,
        options: { expiresIn: configConstant.REFRESH_TOKEN_EXPIRY },
    })
    await userService.updateUser(userId, { token: refreshToken })

    return {
        accessToken,
        refreshToken,
    }
}

module.exports = {
    generateToken,
    verifyToken,
    generateAuthTokens,
    decodeToken,
}
