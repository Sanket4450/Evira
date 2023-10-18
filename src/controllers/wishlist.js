const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
    userService,
    wishlistService
} = require('../services/index.service')

exports.getProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const products = await wishlistService.getWishlistProducts(user._id, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Wishlist Products retrieved successfully'
    )
})