const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const sendResponse = require('../utils/responseHandler')
const {
    userService,
    notificationService
} = require('../services/index.service')

exports.getNotifications = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const notifications = await notificationService.getNotifications(user._id, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { notifications },
        'Notifications retrieved successfully'
    )
})