const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const {
    productService,
    categoryService,
    offerService
} = require('../services/index.service')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
    const specialOffers = await offerService.getOffers({ page: 1, limit: 3 })
    const categories = await categoryService.getCategories({})
    const products = await productService.getProducts({ page: 1, limit: 20 })

    return sendResponse(
        res,
        httpStatus.OK,
        { specialOffers, categories, products },
        'Home data got successfully'
    )
})
