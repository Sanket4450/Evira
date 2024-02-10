const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { promotionService, userService } = require('../services/index.service')

exports.getAdminPromoCodes = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const promoCodes = await promotionService.getAdminPromoCodes({
        page,
        limit,
    })

    return sendResponse(
        res,
        httpStatus.OK,
        { promoCodes },
        'Promo-codes retrieved successfully'
    )
})

exports.postPromoCode = catchAsyncErrors(async (req, res) => {
    const body = {
        remainingUses: req.body.maxUses,
        ...req.body,
    }

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (await promotionService.getPromoCodeByTitle(body.title)) {
        throw new ApiError(
            constant.MESSAGES.PROMO_CODE_TAKEN,
            httpStatus.CONFLICT
        )
    }

    const promoCode = await promotionService.createPromoCode(body)

    return sendResponse(
        res,
        httpStatus.OK,
        { promoCode },
        'Promo-code posted successfully'
    )
})

exports.updatePromoCode = catchAsyncErrors(async (req, res) => {
    const { promoId } = req.params
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await promotionService.getPromoCodeById(promoId))) {
        throw new ApiError(
            constant.MESSAGES.PROMO_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (
        body.title &&
        (await promotionService.getPromoCodeByIdAndTitle(promoId, body.title))
    ) {
        throw new ApiError(
            constant.MESSAGES.PROMO_CODE_TAKEN,
            httpStatus.CONFLICT
        )
    }

    await promotionService.updatePromoCode(promoId, body)

    const promoCode = await promotionService.getPromoCodeById(promoId)

    return sendResponse(
        res,
        httpStatus.OK,
        { promoCode },
        'Promo-code updated successfully'
    )
})

exports.deletePromoCode = catchAsyncErrors(async (req, res) => {
    const { promoId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const promoCode = await promotionService.getPromoCodeById(promoId)

    if (!promoCode) {
        throw new ApiError(
            constant.MESSAGES.PROMO_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await promotionService.deleteShippingType(promoId)

    return sendResponse(
        res,
        httpStatus.OK,
        { promoCode },
        'Promo-code deleted successfully'
    )
})
