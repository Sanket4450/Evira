const httpStatus = require('http-status')
const catchAsyncErrors = require("../utils/catchAsyncErrors")
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const toBoolean = require('../utils/checkBoolean')
const {
    reviewService,
    productService,
    userService
} = require('../services/index.service')

exports.getReviews = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const product = await productService.getProductById(productId)

    if (!product.length) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const reviews = await reviewService.getReviews(productId, req.query)

    return sendResponse(
        res,
        httpStatus.OK,
        { reviews },
        'Reviews retrieved successfully'
    )
})

exports.getReviewsBySearch = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const product = await productService.getProductById(productId)

    if (!product.length) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const reviews = await reviewService.getReviewsBySearch(productId, req.query)

    return sendResponse(
        res,
        httpStatus.OK,
        { reviews },
        'Reviews retrieved successfully'
    )
})

exports.postReview = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const product = await productService.getProductById(productId)

    if (!product.length) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const review = await reviewService.postReview({
        productId,
        userId: user._id,
        ...req.body
    })

    return sendResponse(
        res,
        httpStatus.OK,
        { review },
        'Review posted succcssfully'
    )
})

exports.updateReview = catchAsyncErrors(async (req, res) => {
    const { reviewId } = req.params

    let review = await reviewService.getReviewById(reviewId)

    if (!review) {
        throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (!await reviewService.checkReviewWithUserId(review._id, req.user.sub)) {
        throw new ApiError(constant.MESSAGES.USER_NOT_ALLOWED, httpStatus.FORBIDDEN)
    }

    await reviewService.updateReview(review._id, req.body)

    review = reviewService.getReviewById(review._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { review },
        'Review updated successfully'
    )
})

exports.deleteReview = catchAsyncErrors(async (req, res) => {
    const { reviewId } = req.params

    const review = await reviewService.getReviewById(reviewId)

    if (!review) {
        throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (!await reviewService.checkReviewWithUserId(review._id, req.user.sub)) {
        throw new ApiError(constant.MESSAGES.USER_NOT_ALLOWED, httpStatus.FORBIDDEN)
    }

    await reviewService.deleteReview(review._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { review },
        'Review deleted successfully'
    )
})

exports.toggleLike = catchAsyncErrors(async (req, res) => {
    const { reviewId } = req.params

    let review = await reviewService.getReviewById(reviewId)

    if (!review) {
        throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const like = toBoolean(req.query.like)

    if (!like || !await reviewService.checkReviewLikedWithUserId(review._id, user._id)) {
        await reviewService.likeReview(review._id, user._id, like)
    }

    review = await reviewService.getReviewById(review._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { review },
        `Review ${like ? 'liked' : 'unliked'} successfully`
    )
})
