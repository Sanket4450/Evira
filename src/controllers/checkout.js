const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    checkoutService,
    userService,
    orderService,
    paymentService
} = require('../services/index.service')

exports.getShippingTypes = catchAsyncErrors(async (req, res) => {
    const shippingTypes = await checkoutService.getShippingTypes()

    return sendResponse(
        res,
        httpStatus.OK,
        { shippingTypes },
        'Shipping-types retrieved successfully'
    )
})

exports.getPromoCodes = catchAsyncErrors(async (req, res) => {
    const promoCodes = await checkoutService.getPromoCodes(Date.now())

    return sendResponse(
        res,
        httpStatus.OK,
        { promoCodes },
        'Promo-codes retrieved successfully'
    )
})

exports.addPromoCode = catchAsyncErrors(async (req, res) => {
    const { promoId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const { discountPercentage } = await checkoutService.checkPromoCodeValidity(promoId, Date.now())

    if (!discountPercentage) {
        throw new ApiError(constant.MESSAGES.PROMO_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { discountPercentage },
        'Promo-code validated successfully'
    )
})

exports.postCheckout = catchAsyncErrors(async (req, res) => {
    const { address, shipping, promo, amount } = req.body
    const userId = req.user.sub

    const checkoutBody = {
        address,
        shipping,
        promo,
        userId
    }

    const { products, finalAmount } = await checkoutService.postCheckout(checkoutBody)

    if (Math.round(amount) !== Math.round(finalAmount)) {
        throw new ApiError(constant.MESSAGES.AMOUNT_NOT_MATCH, httpStatus.CONFLICT)
    }

    const orderBody = {
        products,
        address,
        shippingType: shipping,
        amount: finalAmount
    }

    const order = await orderService.createOrder(userId, orderBody)

    return sendResponse(
        res,
        httpStatus.OK,
        { orderId: order._id },
        'Checkout successfull'
    )
})

exports.getPaymentMethods = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const paymentMethods = await paymentService.getPaymentMethods(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { paymentMethods },
        'Payment-methods retrieved successfully'
    )
})

exports.prePayment = catchAsyncErrors(async (req, res) => {
    const { orderId, paymentId } = req.body
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const order = await orderService.getOrderById(orderId, user._id)

    if (!order) {
        throw new ApiError(constant.MESSAGES.ORDER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await paymentService.checkPaymentMethod({ paymentId, userId: user._id, amount: order.amount })

    const orderBody = {
        paymentMethod: paymentId
    }

    await orderService.updateOrder(orderId, orderBody)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Payment-method verified successfully'
    )
})

exports.postPayment = catchAsyncErrors(async (req, res) => {
    const { orderId, pin } = req.body

    const paymentBody = {
        userId: req.user.sub,
        orderId,
        pin
    }

    const order = await paymentService.postPayment(paymentBody)

    return sendResponse(
        res,
        httpStatus.OK,
        { order },
        'Payment successfull'
    )
})
