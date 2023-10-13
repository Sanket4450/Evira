const catchAsyncErrors = require('../utils/catchAsyncErrors')
const responseHandler = require('../utils/responseHandler')
const {
    productService
} = require('../services/index.service')
const httpStatus = require('http-status')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
    const specialOffers = await productService.getOffers()
    const categories = await productService.getCategories()
    const products = await productService.getAllProducts()

    return responseHandler(
        res,
        httpStatus.OK,
        { specialOffers, categories, products },
        'Home data got successfully'
    )
})