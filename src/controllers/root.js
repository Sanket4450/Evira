const catchAsyncErrors = require('../utils/catchAsyncErrors')
const responseHandler = require('../utils/responseHandler')
const {
    productService,
    categoryService,
    offerService
} = require('../services/index.service')
const httpStatus = require('http-status')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
    const specialOffers = await offerService.getOffers()
    const categories = await categoryService.getCategories()
    const products = await productService.getProducts({page: 1, limit: 20})

    return responseHandler(
        res,
        httpStatus.OK,
        { specialOffers, categories, products },
        'Home data got successfully'
    )
})