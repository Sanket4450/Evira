const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    authService,
    userService,
    tokenService
} = require('../services/index.service')

exports.register = catchAsyncErrors(async (req, res) => {
    const body = req.body

    await authService.checkUserWithEmail(body.email)

    const user = await userService.createUser(body)

    const tokens = await tokenService.generateAuthTokens(user._id)

    Logger.info('User signup successfully => ' + body.email)

    return sendResponse(
        res,
        httpStatus.OK,
        { user, tokens },
        'You have signup successfully'
    )
})

exports.login = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body

    const user = await authService.loginWithEmailAndPassword(email, password)

    const tokens = await tokenService.generateAuthTokens(user._id)

    Logger.info('User login successfully => ' + email)

    return sendResponse(
        res,
        httpStatus.OK,
        { user, tokens },
        'You have logged-in successfully'
    )
})

exports.forgotPasswordWithEmail = catchAsyncErrors(async (req, res) => {
    const resetToken = await authService.forgotPasswordWithEmail(req.body.email)

    // send an otp on the email (ex. 1234)

    return sendResponse(
        res,
        httpStatus.OK,
        { resetToken },
        'Forgot password successfully'
    )
})

exports.forgotPasswordWithMobile = catchAsyncErrors(async (req, res) => {
    const resetToken = await authService.forgotPasswordWithMobile(req.body.mobile)

    // send an otp on the mobile (ex. 1234)

    return sendResponse(
        res,
        httpStatus.OK,
        { resetToken },
        'Forgot password successfull'
    )
})

exports.verifyResetOtp = catchAsyncErrors(async (req, res) => {
    const { token, otp } = req.body

    await authService.verifyResetOtp({ token, otp })

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'OTP verified successfully'
    )
})

exports.resetPassword = catchAsyncErrors(async (req, res) => {
    const { token, password } = req.body

    await authService.resetPassword({ token, password })

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Password updated successfully'
    )
})

exports.refreshTokens = catchAsyncErrors(async (req, res) => {
    const { token } = req.body

    const user = await authService.refreshTokens(token)

    const tokens = await tokenService.generateAuthTokens(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { tokens },
        'Token refreshed successfully'
    )
})

exports.logout = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.updateUser(user._id, { token: null })

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'User have logged-out successfully'
    )
})
