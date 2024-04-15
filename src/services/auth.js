const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const userService = require('./user')
const tokenService = require('./token')
const emailService = require('./email')

exports.checkUserWithEmail = async (email) => {
    Logger.info(`Inside checkUserWithEmail => email = ${email}`)

    const user = await userService.getUserByEmail(email)

    if (user) {
        throw new ApiError(
            constant.MESSAGES.USER_EXISTS_WITH_EMAIL,
            httpStatus.CONFLICT
        )
    }
    Logger.info('User not found inside checkUserWithEmail')
}

exports.loginWithEmailAndPassword = async (email, password) => {
    Logger.info(`Inside loginWithEmailAndPassword => email = ${email}`)

    const user = await userService.getUserByEmail(email)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_EXIST_WITH_EMAIL,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await bcrypt.compare(password, user.password))) {
        throw new ApiError(
            constant.MESSAGES.INCORRECT_PASSWROD,
            httpStatus.FORBIDDEN
        )
    }
    return user
}

exports.forgotPasswordWithEmail = async (email, isAdmin) => {
    Logger.info(`Inside forgotPasswordWithEmail => email = ${email}`)

    const user = await userService.getUserByEmail(email)

    if (!isAdmin && !user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_EXIST_WITH_EMAIL,
            httpStatus.NOT_FOUND
        )
    }

    if (isAdmin && !user || isAdmin && user.role !== 'admin') {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_EXIST_WITH_EMAIL,
            httpStatus.NOT_FOUND
        )
    }

    const otp = Math.floor(Math.random() * 9000) + 1000

    await userService.setResetOTP(user._id, otp)

    await emailService.sendResetOTP({
        name: user.nickName || 'User',
        email,
        otp,
    })

    const resetToken = tokenService.generateToken({
        payload: { sub: user._id },
        secret: process.env.RESET_TOKEN_SECRET,
        options: { expiresIn: process.env.RESET_TOKEN_EXPIRY },
    })

    return resetToken
}

exports.verifyResetOtp = async ({ token, otp }) => {
    Logger.info(`Inside verifyResetOtp => otp = ${otp}`)

    const { sub } = await tokenService.verifyToken(
        token,
        process.env.RESET_TOKEN_SECRET
    )

    const user = await userService.getUserWithOTP(sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.CONFLICT
        )
    }

    if (user.resetOTP !== otp) {
        throw new ApiError(
            constant.MESSAGES.INCORRECT_OTP,
            httpStatus.FORBIDDEN
        )
    }
}

exports.resetPassword = async ({ token, password }) => {
    Logger.info('Inside resetPassword')

    const { sub } = await tokenService.verifyToken(
        token,
        process.env.RESET_TOKEN_SECRET
    )

    await userService.updatePassword(sub, password)
}

exports.resetOldPassword = async ({ userId, oldPassword, password }) => {
    Logger.info('Inside resetOldPassword')

    const user = await userService.getUserPasswordById(userId)

    if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new ApiError(
            constant.MESSAGES.INCORRECT_PASSWROD,
            httpStatus.FORBIDDEN
        )
    }

    await userService.updatePassword(userId, password)
}

exports.refreshTokens = async (token) => {
    Logger.info(`Inside refreshTokens => token = ${token}`)

    const { sub } = await tokenService.verifyToken(
        token,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await userService.getFullUserById(sub, { role: 1, token: 1 })

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.CONFLICT
        )
    }

    if (token !== user.token) {
        throw new ApiError(
            constant.MESSAGES.INVALID_TOKEN,
            httpStatus.UNAUTHORIZED
        )
    }

    return user
}
