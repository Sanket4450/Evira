const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { userService, orderService, reviewService, notificationService, productService } = require('../services/index.service')

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

    for (let order of orders) {
        const orderStatus = await orderService.getOrderStatus(order.id)

        order['status'] = orderStatus.status[0]?.title

        if (type === 'completed') {
            if (orderStatus.status[0]?.title === 'Canceled' || await reviewService.checkReviewPosted(order.product, user._id)) {
                order['isReviewPosted'] = true
            } else {
                order['isReviewPosted'] = false
            }
        }
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { orders },
        `${type} Orders retrieved successfully`
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
        type: 'completed',
    }
    const pushBody = {
        title: 'Canceled',
        description: 'Order canceled due to some conflit',
        date: Date.now(),
    }

    await orderService.updateOrder(orderId, updateBody)
    await orderService.updateOrderStatus(orderId, pushBody)

    await productService.modifyVariantQuantity(
        order.item?.product,
        order.item?.variant,
        order.item?.quantity
    )

    const notificationBody = {
      title: 'Order Cancel!',
      message: 'Your order has been canceled',
      icon: constant.NOTIFICATIONS.DELIVERY,
    }

    await notificationService.createNotification(user._id, notificationBody)

    order = await orderService.getOrderById(orderId, user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Order canceled successfully'
    )
})

exports.getAdminOrders = catchAsyncErrors(async (req, res) => {
    const { status, page, limit } = req.query

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const orders = await orderService.getAdminOrders(status, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { orders },
        'Order retrieved successfully'
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

    let [order] = await orderService.getAdminOrderById(orderId)

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
    let { status } = req.body

    let order = await orderService.getAdminOrderInfoById(orderId)

    if (!order) {
        throw new ApiError(
            constant.MESSAGES.ORDER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (status) {
        if (!status.title) {
            throw new ApiError(
                constant.MESSAGES.STATUS_TITLE_REQUIRED,
                httpStatus.BAD_REQUEST
            )
        }

        const currentStatus = order.status[0]

        if (currentStatus.title === status.title) {
            throw new ApiError(
                constant.MESSAGES.STATUS_ALREADY_UPDATED,
                httpStatus.CONFLICT
            )
        }

        if (currentStatus.title === 'Canceled') {
            throw new ApiError(constant.MESSAGES.STATUS_CANNOT_UPDATE, httpStatus.CONFLICT)
        }

        const type = status.title === 'Delivered' || status.title === 'Canceled' ? 'completed' : 'ongoing'
        await orderService.updateOrder(orderId, { type })

        if (status.isForwardDirection === false) {
            await orderService.removeLatestOrderStatus(orderId)
        }
        else if (status.isForwardDirection === true) {
            const statusBody = {
                title: status.title,
                description:
                    status.description || `Order ${status.title} successfully`,
                date: Date.now(),
            }

            await orderService.updateOrderStatus(orderId, statusBody)
        }
        else {
          throw new ApiError(
            constant.MESSAGES.STATUS_DIRECTION_REQUIRED,
            httpStatus.BAD_REQUEST
          )
        }

        if (status.title === 'Delivered') {
            await productService.increaseSoldCount(order.item?.product, order.item?.quantity)
        } else if (status.title === 'Canceled') {
            await productService.modifyVariantQuantity(
                order.item?.product,
                order.item?.variant,
                order.item?.quantity
            )
        } else null

        const notificationBody = {
          title: `${status.title}!`,
          message: `Your order is ${status.title}`,
          icon: constant.NOTIFICATIONS.DELIVERY,
        }

        await notificationService.createNotification(order.user, notificationBody)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Order updated successfully'
    )
})
