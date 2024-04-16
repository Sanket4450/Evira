const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
    userService,
    notificationService,
} = require('../services/index.service')

exports.getNotifications = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const notifications = await notificationService.getNotifications(user._id, {
        page,
        limit,
    })

    const allNotifications = await notificationService.getAllNotifications(user._id)

    allNotifications.forEach(async (notification) => {
        await notificationService.updateNotification(notification._id.toString())
    })

    return sendResponse(
        res,
        httpStatus.OK,
        { notifications },
        'Notifications retrieved successfully'
    )
})

exports.deleteNotifications = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await notificationService.deleteAllNotifications(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'All Notifications deleted successfully'
    )
})


exports.deleteNotification = catchAsyncErrors(async (req, res) => {
    const { notificationId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (
        !(await notificationService.getNotificationById(
            notificationId,
            user._id
        ))
    ) {
        throw new ApiError(
            constant.MESSAGES.NOTIFICATION_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await notificationService.deleteNotification(notificationId)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Notification deleted successfully'
    )
})
