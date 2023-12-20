const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const userService = require('./user')
const tokenService = require('./token')

exports.checkUserWithEmail = async (email) => {
    Logger.info(`Inside checkUserWithEmail => email = ${email}`)

    const user = await userService.getUserByEmail(email)

    if (user) {
        throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
    }
    Logger.info('User not found inside checkUserWithEmail')
}

exports.loginWithEmailAndPassword = async (email, password) => {
    Logger.info(`Inside loginWithEmailAndPassword => email = ${email}`)

    const user = await userService.getUserByEmail(email)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.NOT_FOUND)
    }

    if (!(await bcrypt.compare(password, user.password))) {
        throw new ApiError(constant.MESSAGES.INCORRECT_PASSWROD, httpStatus.FORBIDDEN)
    }
    return user
}

exports.forgotPasswordWithEmail = async (email) => {
    Logger.info(`Inside forgotPasswordWithEmail => email = ${email}`)

    const user = await userService.getUserByEmail(email)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.NOT_FOUND)
    }

    const resetToken = tokenService.generateToken({
        payload: { sub: user._id },
        secret: process.env.RESET_TOKEN_SECRET,
        options: { expiresIn: process.env.RESET_TOKEN_EXPIRY }
    })

    return resetToken
}

exports.forgotPasswordWithMobile = async (mobile) => {
    Logger.info(`Inside forgotPasswordWithMobile => mobile = ${mobile}`)

    const user = await userService.getUserByMobile(mobile)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.NOT_FOUND)
    }

    const resetToken = tokenService.generateToken({
        payload: { sub: user._id },
        secret: process.env.RESET_TOKEN_SECRET,
        options: { expiresIn: process.env.RESET_TOKEN_EXPIRY }
    })

    return resetToken
}

exports.verifyResetOtp = async ({ token, otp }) => {
    Logger.info('Inside verifyResetOtp')

    const { sub } = await tokenService.verifyToken(token, process.env.RESET_TOKEN_SECRET)

    const user = await userService.getUserById(sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.CONFLICT)
    }

    // verify otp sent to the email or mobile (ex. 1234)
    if (otp != 1234) {
        throw new ApiError(constant.MESSAGES.INCORRECT_OTP, httpStatus.FORBIDDEN)
    }
}

exports.resetPassword = async ({ token, password }) => {
    Logger.info('Inside resetPassword')

    const { sub } = await tokenService.verifyToken(token, process.env.RESET_TOKEN_SECRET)

    await userService.updatePassword(sub, password)
}

exports.refreshTokens = async (token) => {
    Logger.info(`Inside refreshTokens => token = ${token}`)

    const { sub } = await tokenService.verifyToken(token, process.env.REFRESH_TOKEN_SECRET)

    const user = await userService.getFullUserById(sub, { role: 1, token: 1 })

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.CONFLICT)
    }

    if (token !== user.token) {
        throw new ApiError(constant.MESSAGES.INVALID_TOKEN, httpStatus.UNAUTHORIZED)
    }

    return user
}
