const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
    userService
} = require('../services/index.service')

exports.getProfile = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { user }
    )
})

exports.updateProfile = catchAsyncErrors(async (req, res) => {
    const body = req.body

    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.updateUser(user._id, body)

    user = await userService.getUserById(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile updated successfully'
    )
})

exports.deleteProfile = catchAsyncErrors(async (req, res) => {
    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.deleteUserById(user._id)

    user = await userService.getUserById(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile deleted successfully'
    )
})

exports.toggleNotifications = catchAsyncErrors(async (req, res) => {
    const { enabled } = req.query

    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (enabled === 'true') await userService.updateUser(user._id, { isNotificationEnabled: true })
    else if (enabled === 'false') await userService.updateUser(user._id, { isNotificationEnabled: false })
    else throw new ApiError(`The 'enabled' query parameter is invalid. Please use 'true' or 'false' to toggle notifications.`,
        httpStatus.BAD_REQUEST)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        `Notifications ${enabled === 'true' ? 'enabled' : 'disabled'} successfully`
    )
})