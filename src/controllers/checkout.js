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

exports.applyPromoCode = catchAsyncErrors(async (req, res) => {
    const { promoId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await promotionService.getPromoCodeById(promoId))) {
        throw new ApiError(
            constant.MESSAGES.PROMO_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const promo = await promotionService.checkPromoCodeValidity(
        promoId,
        Date.now()
    )

    if (!promo) {
        throw new ApiError(constant.MESSAGES.PROMO_EXPIRED, httpStatus.CONFLICT)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { discountPercentage: promo.discountPercentage },
        'Promo-code validated successfully'
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
            constant.MESSAGES.AMOUNT_NOT_MATCH,
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
