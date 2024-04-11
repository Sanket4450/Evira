const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const {
    productService,
    categoryService,
    offerService,
    userService,
    notificationService,
} = require('../services/index.service')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)
    console.log(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const specialOffers = await offerService.getOffers({ page: 1, limit: 3 })
    const categories = await categoryService.getCategories({})
    let products = await productService.getProducts({ page: 1, limit: 20 })

    products = await productService.validateLikedProducts(user._id, products)

    const unreadNotifications = await notificationService.getUnreadNotifications(user._id)

    const newNotifications = unreadNotifications.length !== 0

    return sendResponse(
        res,
        httpStatus.OK,
        { specialOffers, categories, products, newNotifications },
        'Home data got successfully'
    )
})
