const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { userService, orderService } = require('../services/index.service')

exports.getOrders = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query
    const { type } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const orders = await orderService.getOrders(type, user._id, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { orders },
        `${
            type === 'ongoing' ? 'Ongoing' : 'Completed'
        } Orders retrieved successfully`
    )
})

exports.trackOrder = catchAsyncErrors(async (req, res) => {
    const { orderId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const order = await orderService.getTrackOrder(orderId, user._id)

    if (!order) {
        throw new ApiError(
            constant.MESSAGES.ORDER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Order-details retrieved successfully'
    )
})

exports.cancelOrder = catchAsyncErrors(async (req, res) => {
    const { orderId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let order = await orderService.getOrderById(orderId, user._id)

    if (!order) {
        throw new ApiError(
            constant.MESSAGES.ORDER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (order.status.find((status) => status.title === 'Canceled')) {
        throw new ApiError(
            constant.MESSAGES.ORDER_ALREADY_CANCELED,
            httpStatus.CONFLICT
        )
    }

    const updateBody = {
        type: 'Completed',
    }
    const pushBody = {
        title: 'Canceled',
        description: 'Order canceled due to some conflit',
        date: Date.now(),
    }

    await orderService.updateOrder(orderId, updateBody)
    await orderService.updateOrderStatus(orderId, pushBody)

    order = await orderService.getOrderById(orderId, user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Order canceled successfully'
    )
})

exports.getAdminOrders = catchAsyncErrors(async (req, res) => {
    const { type, page, limit } = req.query

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const orders = await orderService.getAdminOrders(type, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { orders },
        'Orders retrieved successfully'
    )
})

exports.getAdminOrder = catchAsyncErrors(async (req, res) => {
    const { orderId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let order = await orderService.getAdminOrderById(orderId)

    if (!order) {
        throw new ApiError(
            constant.MESSAGES.ORDER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Orders retrieved successfully'
    )
})

exports.updateOrder = catchAsyncErrors(async (req, res) => {
    const { orderId } = req.params
    const { address, type, status } = req.body

    let order = await orderService.getAdminOrderInfoById(orderId)

    if (!order) {
        throw new ApiError(
            constant.MESSAGES.ORDER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (address) {
        if (!userService.getAddressById(address, order.user)) {
            throw new ApiError(
                constant.MESSAGES.ADDRESS_NOT_FOUND,
                httpStatus.NOT_FOUND
            )
        }
        await orderService.updateOrder(orderId, { address })
    }

    type ||= 'ongoing'
    await orderService.updateOrder(orderId, { type })

    if (status) {
        if (order.status.find((sts) => sts.title === status.title)) {
            throw new ApiError(
                constant.MESSAGES.STATUS_ALREADY_UPDATED,
                httpStatus.CONFLICT
            )
        }

        const statusBody = {
            title: status.title,
            description:
                status.description || `Order ${status.title} successfully`,
            date: status.date || Date.now(),
        }

        await orderService.updateOrderStatus(orderId, statusBody)
    }

    order = await orderService.getAdminOrderById(orderId)

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Order updated successfully'
    )
})
