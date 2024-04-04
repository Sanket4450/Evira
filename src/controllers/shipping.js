const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { shippingService, userService } = require('../services/index.service')

exports.getAdminShippingTypes = catchAsyncErrors(async (req, res) => {
    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const shippingTypes = await shippingService.getAdminShippingTypes()

    return sendResponse(
        res,
        httpStatus.OK,
        { shippingTypes },
        'Shipping-types retrieved successfully'
    )
})

exports.postShippingType = catchAsyncErrors(async (req, res) => {
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (await shippingService.getShippingTypeByTitle(body.title)) {
        throw new ApiError(
            constant.MESSAGES.SHIPPING_TITLE_TAKEN,
            httpStatus.CONFLICT
        )
    }

    const shippingType = await shippingService.createShippingType(body)

    return sendResponse(
        res,
        httpStatus.OK,
        { shippingType },
        'Shipping-type posted successfully'
    )
})

exports.updateShippingType = catchAsyncErrors(async (req, res) => {
    const { shippingId } = req.params
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await shippingService.getShippingTypeById(shippingId))) {
        throw new ApiError(
            constant.MESSAGES.SHIPPING_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (
        body.title &&
        (await shippingService.getShippingTypeByTitle(body.title))
    ) {
        throw new ApiError(
            constant.MESSAGES.SHIPPING_TITLE_TAKEN,
            httpStatus.CONFLICT
        )
    }

    await shippingService.updateShippingType(shippingId, body)

    const shippingType = await shippingService.getShippingTypeById(shippingId)

    return sendResponse(
        res,
        httpStatus.OK,
        { shippingType },
        'Shipping-type updated successfully'
    )
})

exports.deleteShippingType = catchAsyncErrors(async (req, res) => {
    const { shippingId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const shippingType = await shippingService.getShippingTypeById(shippingId)

    if (!shippingType) {
        throw new ApiError(
            constant.MESSAGES.SHIPPING_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await shippingService.deleteShippingType(shippingId)

    return sendResponse(
        res,
        httpStatus.OK,
        { shippingType },
        'Shipping-type deleted successfully'
    )
})
