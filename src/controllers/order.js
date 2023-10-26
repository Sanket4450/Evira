const httpStatus = require("http-status");
const catchAsyncErrors = require("../utils/catchAsyncErrors")
const sendResponse = require('../utils/responseHandler')
const ApiError = require("../utils/ApiError")
const constant = require('../constants')
const {
    userService,
    orderService
} = require('../services/index.service');

exports.getOrders = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query
    const { type } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const orders = await orderService.getOrders(type, user._id, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { orders },
        `${type === 'ongoing' ? 'Ongoing' : 'Completed'} Orders retrieved successfully`
    )
})

exports.trackOrder = catchAsyncErrors(async (req, res) => {
    const { orderId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const order = await orderService.getTrackOrder(orderId, user._id)

    if (!order) {
        throw new ApiError(constant.MESSAGES.ORDER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Order details retrieved successfully'
    )
})
