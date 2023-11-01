const httpStatus = require("http-status");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const sendResponse = require('../utils/responseHandler')
const ApiError = require("../utils/ApiError");
const constant = require("../constants");
const {
    offerService,
    userService,
    productService
} = require('../services/index.service');

exports.getOffers = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const specialOffers = await offerService.getOffers({ page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { specialOffers },
        'Special offers retrieved successfully'
    )
})

exports.getAdminOffer = catchAsyncErrors(async (req, res) => {
    const { offerId } = req.params

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const offer = await offerService.getOfferById(offerId)

    if (!offer) {
        throw new ApiError(constant.MESSAGES.OFFER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { offer },
        'Special offer retrieved successfully'
    )
})

exports.postOffer = catchAsyncErrors(async (req, res) => {
    const body = req.body

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (!await productService.getProductById(body.product)) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (await offerService.getOfferByProduct(body.product)) {
        throw new ApiError(constant.MESSAGES.OFFER_ALREADY_EXISTS, httpStatus.CONFLICT)
    }

    const offer = await offerService.createOffer(body)

    return sendResponse(
        res,
        httpStatus.OK,
        { offer },
        'Special offer posted successfully'
    )
})

exports.updateOffer = catchAsyncErrors(async (req, res) => {
    const { offerId } = req.params
    const body = req.body

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (!await offerService.getOfferById(offerId)) {
        throw new ApiError(constant.MESSAGES.OFFER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (body.product) {
        if (!await productService.getProductById(body.product)) {
            throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
        }

        if (await offerService.getOfferByProduct(body.product)) {
            throw new ApiError(constant.MESSAGES.OFFER_ALREADY_EXISTS, httpStatus.CONFLICT)
        }
    }

    await offerService.updateOffer(offerId, body)

    const offer = await offerService.getOfferById(offerId)

    return sendResponse(
        res,
        httpStatus.OK,
        { offer },
        'Special offer updated successfully'
    )
})

exports.deleteOffer = catchAsyncErrors(async (req, res) => {
    const { offerId } = req.params

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const offer = await offerService.getOfferById(offerId)

    if (!offer) {
        throw new ApiError(constant.MESSAGES.OFFER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await offerService.deleteOffer(offerId)

    return sendResponse(
        res,
        httpStatus.OK,
        { offer },
        'Special offer deleted successfully'
    )
})
