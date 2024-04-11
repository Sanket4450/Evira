const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    authService,
    userService,
    tokenService,
    notificationService
} = require('../services/index.service')

exports.register = catchAsyncErrors(async (req, res) => {
    const body = req.body

    await authService.checkUserWithEmail(body.email)

    if (body.role === 'admin' && body.secret !== process.env.ADMIN_SECRET) {
        throw new ApiError(
            constant.MESSAGES.INVALID_SECRET,
            httpStatus.FORBIDDEN
        )
    }

    const user = await userService.createUser(body)

    const tokens =
        body.role === 'admin'
            ? await tokenService.generateAuthTokens(user._id, 'admin')
            : await tokenService.generateAuthTokens(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { tokens },
        'You have signed-up successfully'
    )
})

exports.login = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body

    const { _id, role, isProfileCompleted } =
        await authService.loginWithEmailAndPassword(email, password)

    const tokens = await tokenService.generateAuthTokens(_id, role)

    Logger.info('User login successfully => ' + email)

    return sendResponse(
        res,
        httpStatus.OK,
        { tokens, isProfileCompleted },
        'You have logged-in successfully'
    )
})

exports.forgotPasswordWithEmail = catchAsyncErrors(async (req, res) => {
    const resetToken = await authService.forgotPasswordWithEmail(req.body.email)

    return sendResponse(
        res,
        httpStatus.OK,
        { resetToken },
        'Forgot password successfully'
    )
})

exports.verifyResetOtp = catchAsyncErrors(async (req, res) => {
    const { token, otp } = req.body

    await authService.verifyResetOtp({ token, otp })

    return sendResponse(res, httpStatus.OK, {}, 'OTP verified successfully')
})

exports.resetPassword = catchAsyncErrors(async (req, res) => {
    const { token, password } = req.body

    await authService.resetPassword({ token, password })

    return sendResponse(res, httpStatus.OK, {}, 'Password updated successfully')
})

exports.resetOldPassword = catchAsyncErrors(async (req, res) => {
    const { oldPassword, password } = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_EXIST,
            httpStatus.NOT_FOUND
        )
    }

    const notificationBody = {
      title: 'Password Reset!',
      message: 'Password reset successfully',
      icon: constant.NOTIFICATIONS.USER,
    }

    await notificationService.createNotification(user._id, notificationBody)


    await authService.resetOldPassword({ userId: user._id, oldPassword, password })

    return sendResponse(res, httpStatus.OK, {}, 'Password updated successfully')
})

exports.refreshTokens = catchAsyncErrors(async (req, res) => {
    const { token } = req.body

    const user = await authService.refreshTokens(token)

    const tokens =
        user.role === 'admin'
            ? await tokenService.generateAuthTokens(user._id, 'admin')
            : await tokenService.generateAuthTokens(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { tokens },
        'Token refreshed successfully'
    )
})

exports.logout = catchAsyncErrors(async (req, res) => {
    const user = await userService.getFullUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.updateUser(user._id, { token: null })

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'User has logged-out successfully'
    )
})
