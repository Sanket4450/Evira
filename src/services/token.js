const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const userService = require('./user')

const generateToken = ({ payload, secret, options }) => {
    return jwt.sign(payload, secret, options)
}

/**
 * 
 * @param {string} token 
 * @param {string} secret 
 * @returns object
 */

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    reject(new ApiError(constant.MESSAGES.AUTHENTICATION_FAILED, httpStatus.UNAUTHORIZED))
                }
                reject(new ApiError(err.message, httpStatus.UNAUTHORIZED))
            } else {
                resolve(decoded)
            }
        })
    })
}

const generateAuthTokens = async (userId, role = 'user') => {
    const payload = {
        sub: userId,
        role
    }
    const accessToken = generateToken({
        payload,
        secret: config.ACCESS_TOKEN_SECRET,
        options: { expiresIn: config.ACCESS_TOKEN_EXPIRY }
    })
    const refreshToken = generateToken({
        payload,
        secret: config.REFRESH_TOKEN_SECRET,
        options: { expiresIn: config.REFRESH_TOKEN_EXPIRY }
    })
    await userService.updateUser(userId, { token: refreshToken })

    return {
        accessToken,
        refreshToken
    }
}

module.exports = {
    generateToken,
    verifyToken,
    generateAuthTokens
}