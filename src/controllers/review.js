const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
  reviewService,
  productService,
  userService,
} = require('../services/index.service')

exports.getReviews = catchAsyncErrors(async (req, res) => {
  const { productId } = req.params

  const user = await userService.getUserById(req.user.sub)

  if (!user) {
    throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const product = await productService.getProductById(productId)

  if (!product) {
    throw new ApiError(
      constant.MESSAGES.PRODUCT_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  let reviews = await reviewService.getReviews(productId, req.query)

  reviews = await reviewService.validateEditableReviews(user._id, reviews)

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

  if (!product) {
    throw new ApiError(
      constant.MESSAGES.PRODUCT_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  const review = await reviewService.postReview({
    product: productId,
    user: user._id,
    ...req.body,
  })

  return sendResponse(
    res,
    httpStatus.OK,
    { review },
    'Review posted succcssfully'
  )
})

exports.getReviewsBySearch = catchAsyncErrors(async (req, res) => {
  const { productId } = req.params

  const user = await userService.getUserById(req.user.sub)

  if (!user) {
    throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const product = await productService.getProductById(productId)

  if (!product) {
    throw new ApiError(
      constant.MESSAGES.PRODUCT_NOT_FOUND,
      httpStatus.NOT_FOUND
    )
  }

  let reviews = await reviewService.getReviewsBySearch(productId, req.query)
  
  reviews = await reviewService.validateEditableReviews(user._id, reviews)

  return sendResponse(
    res,
    httpStatus.OK,
    { reviews },
    'Reviews retrieved successfully'
  )
})

exports.updateReview = catchAsyncErrors(async (req, res) => {
  const { reviewId } = req.params

  if (!(await reviewService.getReviewById(reviewId))) {
    throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (!(await reviewService.checkReviewWithUserId(reviewId, req.user.sub))) {
    throw new ApiError(constant.MESSAGES.USER_NOT_ALLOWED, httpStatus.FORBIDDEN)
  }

  await reviewService.updateReview(reviewId, req.body)

  const review = await reviewService.getReviewById(reviewId)

  return sendResponse(
    res,
    httpStatus.OK,
    { review },
    'Review updated successfully'
  )
})

exports.deleteReview = catchAsyncErrors(async (req, res) => {
  const { reviewId } = req.params

  if (!(await reviewService.getReviewById(reviewId))) {
    throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (!(await reviewService.checkReviewWithUserId(reviewId, req.user.sub))) {
    throw new ApiError(constant.MESSAGES.USER_NOT_ALLOWED, httpStatus.FORBIDDEN)
  }

  await reviewService.deleteReview(reviewId)

  return sendResponse(res, httpStatus.OK, {}, 'Review deleted successfully')
})

exports.toggleLike = catchAsyncErrors(async (req, res) => {
  const { reviewId } = req.params
  const { isLiked } = req.body

  let review = await reviewService.getReviewById(reviewId)

  if (!review) {
    throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const user = await userService.getUserById(req.user.sub)

  if (!user) {
    throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (
    !isLiked ||
    !(await reviewService.checkReviewLikedWithUserId(reviewId, user._id))
  ) {
    await reviewService.likeUnlikeReview(reviewId, user._id, isLiked)
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { isLiked },
    `Review ${isLiked ? 'liked' : 'unliked'} successfully`
  )
})

exports.deleteAdminReview = catchAsyncErrors(async (req, res) => {
  const { reviewId } = req.params

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const review = await reviewService.getReviewById(reviewId)

  if (!review) {
    throw new ApiError(constant.MESSAGES.REVIEW_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  await reviewService.deleteReview(reviewId)

  return sendResponse(
    res,
    httpStatus.OK,
    { review },
    'Review deleted successfully'
  )
})
