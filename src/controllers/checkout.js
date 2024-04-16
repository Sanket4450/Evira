const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    shippingService,
    promotionService,
    checkoutService,
    userService,
    cartService,
    orderService,
} = require('../services/index.service')

exports.getShippingTypes = catchAsyncErrors(async (_, res) => {
    const shippingTypes = await shippingService.getShippingTypes()

    return sendResponse(
        res,
        httpStatus.OK,
        { shippingTypes },
        'Shipping-types retrieved successfully'
    )
})

exports.getPromoCodes = catchAsyncErrors(async (_, res) => {
    const promoCodes = await promotionService.getPromoCodes(Date.now())

    return sendResponse(
        res,
        httpStatus.OK,
        { promoCodes },
        'Promo-codes retrieved successfully'
    )
})

exports.postCheckout = catchAsyncErrors(async (req, res) => {
    const { address, shipping, promo, amount } = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const checkoutBody = {
        address,
        shipping,
        promo,
        userId: user._id,
    }

    const { items, finalAmount } = await checkoutService.postCheckout(
        checkoutBody
    )

    if (Math.round(amount) !== Math.round(finalAmount)) {
        throw new ApiError(
            constant.MESSAGES.AMOUNT_NOT_MATCHED,
            httpStatus.CONFLICT
        )
    }

    for (let item of items) {
        const orderBody = {
            item: {
                product: item.product,
                variant: item.variant,
                quantity: item.quantity,
            },
            address,
            shippingType: shipping,
            amount: item.amount,
            type: 'ongoing',
            status: {
                title: 'Ordered',
                description: 'Order placed successfully',
                date: Date.now(),
            },
        }
        await orderService.createOrder(user._id, orderBody)
    }

    await cartService.emptyCart(user._id)

    return sendResponse(res, httpStatus.OK, {}, 'Checkout successfull')
})
